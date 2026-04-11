'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  FileDown, 
  FileUp,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import * as GoogleDrive from '@/lib/google-drive';

interface GoogleDriveSyncProps {
  onDataLoad: (data: {
    projects?: unknown[];
    leads?: unknown[];
    customFields?: unknown[];
    pipelineStages?: unknown[];
  }) => void;
  getData: () => {
    projects: unknown[];
    leads: unknown[];
    customFields: unknown[];
    pipelineStages: unknown[];
  };
}

export default function GoogleDriveSync({ onDataLoad, getData }: GoogleDriveSyncProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [credentialsConfigured, setCredentialsConfigured] = useState(false);

  // Verificar si las credenciales están configuradas
  useEffect(() => {
    const hasClientId = GoogleDrive.GOOGLE_CLIENT_ID && GoogleDrive.GOOGLE_CLIENT_ID !== 'TU_GOOGLE_CLIENT_ID_AQUI';
    const hasApiKey = GoogleDrive.GOOGLE_API_KEY && GoogleDrive.GOOGLE_API_KEY !== 'TU_GOOGLE_API_KEY_AQUI';
    setCredentialsConfigured(hasClientId && hasApiKey);
  }, []);

  // Mostrar advertencia si las credenciales no están configuradas
  const showCredentialWarning = !credentialsConfigured;

  // Verificar autenticación al montar
  useEffect(() => {
    checkAuth();
    
    // Manejar callback de OAuth
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      handleAuthCallback();
    }

    // Cargar última fecha de sincronización
    const lastSyncTime = localStorage.getItem('google_drive_last_sync');
    if (lastSyncTime) {
      setLastSync(new Date(parseInt(lastSyncTime)).toLocaleString());
    }
  }, []);

  // Verificar autenticación
  const checkAuth = () => {
    const authenticated = GoogleDrive.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  // Manejar callback de OAuth
  const handleAuthCallback = () => {
    const token = GoogleDrive.handleAuthCallback();
    if (token) {
      setIsAuthenticated(true);
      toast.success('¡Conectado a Google Drive!');
    }
  };

  // Iniciar login con Google
  const handleLogin = () => {
    if (!credentialsConfigured) {
      // Mostrar instrucciones detalladas de configuración
      const instructions = `
Para conectar Google Drive, necesitas configurar las credenciales:

PASO 1: Ir a Google Cloud Console
https://console.cloud.google.com/

PASO 2: Crear un nuevo proyecto o seleccionar uno existente

PASO 3: Habilitar la Google Drive API
- Ve a "APIs & Services" > "Library"
- Busca "Google Drive API" y habilítala

PASO 4: Configurar OAuth 2.0
- Ve a "APIs & Services" > "Credentials"
- Haz clic en "Create Credentials" > "OAuth client ID"
- Tipo de aplicación: "Web application"
- Agrega tu dominio en "Authorized redirect URIs":
  * https://tu-dominio.vercel.app

PASO 5: Configurar variables de entorno en Vercel
En tu proyecto de Vercel:
1. Ve a Settings > Environment Variables
2. Agrega estas variables:
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID = (tu Client ID)
   - NEXT_PUBLIC_GOOGLE_API_KEY = (tu API Key opcional)

PASO 6: Redesplegar
Hace un nuevo commit y push para actualizar el deployment
      `;

      alert('⚠️ CONFIGURACIÓN DE GOOGLE DRIVE\n\n' + instructions);
      return;
    }
    const authUrl = GoogleDrive.getAuthUrl();
    window.location.href = authUrl;
  };

  // Cerrar sesión
  const handleLogout = () => {
    GoogleDrive.logout();
    setIsAuthenticated(false);
    setLastSync(null);
    localStorage.removeItem('google_drive_last_sync');
    toast.success('Desconectado de Google Drive');
  };

  // Sincronizar con Drive
  const handleSync = async () => {
    const accessToken = GoogleDrive.getAccessToken();
    if (!accessToken) {
      toast.error('No hay token de acceso');
      return;
    }

    setIsSyncing(true);
    try {
      const data = getData();
      const result = await GoogleDrive.saveToDrive(accessToken, data);
      
      if (result.success) {
        const now = Date.now();
        setLastSync(new Date(now).toLocaleString());
        localStorage.setItem('google_drive_last_sync', now.toString());
        toast.success(`Datos ${result.action === 'created' ? 'creados' : 'actualizados'} en Google Drive`);
      } else {
        toast.error(result.error || 'Error al sincronizar');
      }
    } catch (error) {
      console.error('Error en sincronización:', error);
      toast.error('Error de conexión con Google Drive');
    } finally {
      setIsSyncing(false);
    }
  };

  // Cargar desde Drive
  const handleLoad = async () => {
    const accessToken = GoogleDrive.getAccessToken();
    if (!accessToken) {
      toast.error('No hay token de acceso');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await GoogleDrive.loadFromDrive(accessToken);
      
      if (result.success && result.data) {
        onDataLoad(result.data);
        const now = Date.now();
        setLastSync(new Date(now).toLocaleString());
        localStorage.setItem('google_drive_last_sync', now.toString());
        toast.success('Datos cargados desde Google Drive');
      } else {
        toast.error(result.error || 'No se encontraron datos en Drive');
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar datos de Google Drive');
    } finally {
      setIsSyncing(false);
    }
  };

  // Exportar a archivo local
  const handleExport = () => {
    try {
      const data = getData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merka-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar backup');
    }
  };

  // Importar desde archivo local
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onDataLoad(data);
        toast.success('Datos importados correctamente');
      } catch (error) {
        console.error('Error al importar:', error);
        toast.error('Error al importar archivo');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm" 
          variant={isAuthenticated ? "default" : "outline"}
          className={isAuthenticated ? "bg-emerald-600 hover:bg-emerald-700" : ""}
        >
          {isAuthenticated ? (
            <>
              <Cloud className="h-4 w-4 mr-1" />
              Google Drive
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4 mr-1" />
              Google Drive
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {isAuthenticated ? (
          <>
            {/* Estado de conexión */}
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Conectado</span>
              </div>
              {lastSync && (
                <p className="text-xs text-slate-500 mt-1">
                  Última sync: {lastSync}
                </p>
              )}
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Acciones de sincronización */}
            <DropdownMenuItem onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Guardar en Drive
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleLoad} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Cargar desde Drive
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Backup local */}
            <DropdownMenuItem onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Backup Local
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <FileUp className="h-4 w-4" />
                Importar Backup Local
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Cerrar sesión */}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Desconectar Google Drive
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* Estado desconectado */}
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">No conectado</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Conecta para sincronizar tus datos
              </p>
              {showCredentialWarning && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-xs text-amber-800 font-medium flex items-center gap-1">
                    ⚠️ Configuración requerida
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Haz clic en "Conectar con Google" para ver las instrucciones
                  </p>
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            {/* Botón de login - SIEMPRE visible */}
            <DropdownMenuItem onClick={handleLogin} className={credentialsConfigured ? "text-emerald-600" : "text-amber-600"}>
              <LogIn className="h-4 w-4 mr-2" />
              {credentialsConfigured ? 'Conectar con Google' : '🔧 Configurar Google Drive'}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Backup local (disponible sin autenticación) */}
            <DropdownMenuItem onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Backup Local
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <FileUp className="h-4 w-4" />
                Importar Backup Local
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
