// Configuración de Google Drive API
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'TU_GOOGLE_CLIENT_ID_AQUI';
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'TU_GOOGLE_API_KEY_AQUI';

// Nombre del archivo donde se guardan los datos en Google Drive
export const DRIVE_FILE_NAME = 'merka-crm-data.json';
export const DRIVE_MIME_TYPE = 'application/json';

// Scopes necesarios
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];

// URL de autenticación
export const getAuthUrl = () => {
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=token&` +
    `scope=${encodeURIComponent(GOOGLE_SCOPES.join(' '))}&` +
    `include_granted_scopes=true`;
};

// Manejar la respuesta de OAuth
export const handleAuthCallback = () => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');
  
  if (accessToken) {
    const expiresAt = Date.now() + (parseInt(expiresIn || '3600') * 1000);
    localStorage.setItem('google_access_token', accessToken);
    localStorage.setItem('google_token_expires_at', expiresAt.toString());
    
    // Limpiar el hash
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return accessToken;
  }
  
  return null;
};

// Obtener token de acceso
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('google_access_token');
  const expiresAt = parseInt(localStorage.getItem('google_token_expires_at') || '0');
  
  if (token && Date.now() < expiresAt) {
    return token;
  }
  
  return null;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  return getAccessToken() !== null;
};

// Cerrar sesión
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('google_token_expires_at');
};

// Buscar el archivo en Google Drive
export const findFileInDrive = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name="${encodeURIComponent(DRIVE_FILE_NAME)}"&spaces=appDataFolder`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    const data = await response.json();
    
    if (data.files && data.files.length > 0) {
      return data.files[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error buscando archivo en Drive:', error);
    throw new Error('Error al buscar archivo en Google Drive');
  }
};

// Crear nuevo archivo en Drive
export const createFileInDrive = async (accessToken: string, content: any) => {
  try {
    // Primero crear un archivo vacío
    const createResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: DRIVE_FILE_NAME,
          parents: ['appDataFolder'],
          mimeType: DRIVE_MIME_TYPE,
        }),
      }
    );
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('Error creando archivo:', error);
      throw new Error('Error al crear archivo en Google Drive');
    }
    
    const fileData = await createResponse.json();
    
    // Actualizar el contenido del archivo
    await updateFileContent(accessToken, fileData.id, content);
    
    return fileData;
  } catch (error) {
    console.error('Error creando archivo en Drive:', error);
    throw error;
  }
};

// Actualizar contenido del archivo
export const updateFileContent = async (accessToken: string, fileId: string, content: any) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': DRIVE_MIME_TYPE,
        },
        body: JSON.stringify(content, null, 2),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Error actualizando archivo:', error);
      throw new Error('Error al actualizar archivo en Google Drive');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error actualizando contenido:', error);
    throw error;
  }
};

// Leer contenido del archivo
export const readFileContent = async (accessToken: string, fileId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al leer archivo de Google Drive');
    }
    
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error leyendo contenido:', error);
    throw error;
  }
};

// Guardar datos en Drive (crear o actualizar)
export const saveToDrive = async (accessToken: string, data: any) => {
  try {
    // Buscar si ya existe el archivo
    const existingFile = await findFileInDrive(accessToken);
    
    if (existingFile) {
      // Actualizar archivo existente
      await updateFileContent(accessToken, existingFile.id, data);
      return { success: true, action: 'updated', fileId: existingFile.id };
    } else {
      // Crear nuevo archivo
      const newFile = await createFileInDrive(accessToken, data);
      return { success: true, action: 'created', fileId: newFile.id };
    }
  } catch (error) {
    console.error('Error guardando en Drive:', error);
    return { success: false, error: String(error) };
  }
};

// Cargar datos desde Drive
export const loadFromDrive = async (accessToken: string) => {
  try {
    const file = await findFileInDrive(accessToken);
    
    if (!file) {
      return { success: false, error: 'No se encontró archivo en Drive' };
    }
    
    const content = await readFileContent(accessToken, file.id);
    return { success: true, data: content, fileId: file.id };
  } catch (error) {
    console.error('Error cargando desde Drive:', error);
    return { success: false, error: String(error) };
  }
};
