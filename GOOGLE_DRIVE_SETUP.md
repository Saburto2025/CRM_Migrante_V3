# Configuración de Google Drive para CRM

El CRM incluye integración con Google Drive para hacer respaldo de los datos. Sin embargo, esta funcionalidad requiere configuración previa.

## Error 401: invalid_client

Si ves este error al intentar conectar con Google Drive, significa que las credenciales de OAuth no están configuradas correctamente en tu entorno de Vercel.

## Pasos para configurar Google Drive

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú, ve a "APIs & Services" > "Credentials"

### 2. Habilitar las APIs necesarias

1. Ve a "APIs & Services" > "Library"
2. Busca y habilita "Google Drive API"
3. Busca y habilita "Google Picker API"

### 3. Crear credenciales OAuth 2.0

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "OAuth client ID"
3. Configura el consentimiento de OAuth si te lo pide:
   - Tipo de usuario: "External"
   - Agrega un nombre de la aplicación
   - Agrega tu correo electrónico
   - No necesitas agregar scopes para esta integración simple
4. Crea el OAuth client ID:
   - Tipo de aplicación: "Web application"
   - Nombre: "CRM Google Drive"
   - Orígenes autorizados de JavaScript: Agrega la URL de Vercel (ej: `https://your-app.vercel.app`)
   - URI de redirección autorizados: Agrega la URL de Vercel (ej: `https://your-app.vercel.app/`)
5. Copia el **Client ID** generado

### 4. Crear una API Key

1. En "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "API Key"
3. Restringe la API Key:
   - Application restrictions: "HTTP referrers"
   - Agrega la URL de Vercel (ej: `https://your-app.vercel.app/*`)
   - API restrictions: Selecciona "Drive API" y "Picker API"
4. Copia la **API Key** generada

### 5. Configurar variables de entorno en Vercel

1. Ve al proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Entra a tu proyecto del CRM
3. Ve a "Settings" > "Environment Variables"
4. Agrega las siguientes variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_GOOGLE_API_KEY=tu_api_key_aqui
```

5. Haz clic en "Save"
6. Redespliega la aplicación (o espera al próximo despliegue automático)

### 6. Prueba la integración

1. Abre la aplicación
2. Haz clic en "Conectar Google Drive"
3. Deberías ver la pantalla de consentimiento de Google
4. Acepta los permisos
5. La integración debería funcionar correctamente

## Solución alternativa: Usar sin Google Drive

Si no deseas configurar Google Drive, el CRM funcionará perfectamente usando la base de datos SQLite. La sincronización con Google Drive es opcional y solo sirve como respaldo adicional.

El CRM guarda todos los datos en:
- Base de datos SQLite (persistente en Vercel)
- LocalStorage del navegador (respaldo local)

Por lo tanto, tus datos están seguros incluso sin Google Drive.
