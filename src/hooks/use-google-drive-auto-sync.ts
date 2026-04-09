import { useEffect } from 'react';
import * as GoogleDrive from '@/lib/google-drive';
import { toast } from 'sonner';

interface UseGoogleDriveAutoSyncOptions {
  data: {
    projects: unknown[];
    leads: unknown[];
    customFields: unknown[];
    pipelineStages: unknown[];
  };
  onDataChange?: (data: any) => void;
  enabled?: boolean;
}

export function useGoogleDriveAutoSync({
  data,
  onDataChange,
  enabled = true,
}: UseGoogleDriveAutoSyncOptions) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Función para guardar antes de cerrar
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const accessToken = GoogleDrive.getAccessToken();
      if (!accessToken) return;

      // Guardar datos en localStorage
      localStorage.setItem('merka-auto-save-pending', 'true');

      // Intentar sincronizar con Drive
      GoogleDrive.saveToDrive(accessToken, data).catch((err) => {
        console.error('Error en auto-sync:', err);
      });
    };

    // Función para cargar datos al iniciar si hay sesión activa
    const autoLoadFromDrive = async () => {
      const accessToken = GoogleDrive.getAccessToken();
      if (!accessToken) return;

      try {
        const result = await GoogleDrive.loadFromDrive(accessToken);
        if (result.success && result.data && onDataChange) {
          // Comparar timestamps para cargar el más reciente
          const localTimestamp = localStorage.getItem('google_drive_last_sync');
          const driveTimestamp = new Date().getTime();

          if (!localTimestamp || driveTimestamp > parseInt(localTimestamp)) {
            onDataChange(result.data);
            toast.success('Datos sincronizados desde Google Drive');
          }
        }
      } catch (error) {
        console.error('Error en auto-load:', error);
      }
    };

    // Auto-load al iniciar (con un pequeño delay para no bloquear)
    const timeoutId = setTimeout(() => {
      autoLoadFromDrive();
    }, 1000);

    // Agregar event listener para antes de cerrar
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [data, onDataChange, enabled]);

  return {
    syncNow: async () => {
      const accessToken = GoogleDrive.getAccessToken();
      if (!accessToken) {
        toast.error('No estás conectado a Google Drive');
        return false;
      }

      try {
        const result = await GoogleDrive.saveToDrive(accessToken, data);
        if (result.success) {
          const now = Date.now();
          localStorage.setItem('google_drive_last_sync', now.toString());
          toast.success('Datos sincronizados con Google Drive');
          return true;
        } else {
          toast.error(result.error || 'Error al sincronizar');
          return false;
        }
      } catch (error) {
        console.error('Error en sync manual:', error);
        toast.error('Error de conexión con Google Drive');
        return false;
      }
    },
  };
}
