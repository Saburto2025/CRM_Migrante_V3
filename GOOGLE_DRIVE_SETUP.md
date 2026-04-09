# 📚 Guía de Configuración de Google Drive para CRM Migrante

## 🎯 ¿Qué hace esta integración?

El CRM ahora puede:
- ✅ **Login con Google** - Usa tu cuenta de Google para autenticarte
- ✅ **Sincronización automática** - Los datos se guardan automáticamente en Google Drive
- ✅ **Persistencia entre dispositivos** - Accede a tus datos desde cualquier computadora
- ✅ **Backup automático al cerrar** - Tus datos se guardan al cerrar el CRM
- ✅ **Importar/Exportar** - Opciones manuales de backup local

---

## 🚀 Paso a Paso: Configurar Google Drive OAuth

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Haz clic en **"APIs & Services"** → **"Library"**
4. Busca **"Google Drive API"** y haz clic en **"Enable"**

### 2. Crear Credenciales OAuth 2.0

1. Ve a **"APIs & Services"** → **"Credentials"**
2. Haz clic en **"+ CREATE CREDENTIALS"**
3. Selecciona **"OAuth client ID"**
4. Si te pide configurar la pantalla de consentimiento:
   - Selecciona **"External"**
   - Completa los campos básicos:
     - **App name**: CRM Migrante
     - **User support email**: tu email
     - **Developer contact**: tu email
   - Haz clic en **"SAVE AND CONTINUE"** varias veces hasta terminar
5. Vuelve a crear el OAuth client ID

### 3. Configurar el OAuth Client ID

1. **Application type**: Selecciona **"Web application"**
2. **Name**: CRM Migrante Web
3. **Authorized JavaScript origins**:
   - Para desarrollo local: `http://localhost:3000`
   - Para Vercel: `https://tu-proyecto.vercel.app` (reemplaza con tu URL)
4. **Authorized redirect URIs**:
   - Para desarrollo local: `http://localhost:3000`
   - Para Vercel: `https://tu-proyecto.vercel.app`
5. Haz clic en **"CREATE"**

### 4. Obtener las Credenciales

1. Copia el **Client ID** (se parece a: `123456789-abc123def456.apps.googleusercontent.com`)
2. Para obtener la API Key:
   - Haz clic en **"+ CREATE CREDENTIALS"** → **"API key"**
   - Copia la API Key generada

### 5. Configurar en tu Proyecto

#### Opción A: Para Desarrollo Local

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las credenciales:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-aqui
NEXT_PUBLIC_GOOGLE_API_KEY=tu-api-key-aqui
```

3. Reinicia el servidor:
```bash
bun run dev
```

#### Opción B: Para Vercel (Producción)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto → **Settings** → **Environment Variables**
3. Agrega las variables:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = tu Client ID
   - `NEXT_PUBLIC_GOOGLE_API_KEY` = tu API Key
4. Haz **Redeploy** para aplicar los cambios

---

## 🎮 Cómo Usar la Integración

### Primer Uso

1. Abre el CRM
2. En la barra superior, haz clic en el botón **"Google Drive"**
3. Selecciona **"Conectar con Google"**
4. Acepta los permisos de Google Drive
5. ¡Listo! Ya estás conectado

### Sincronizar Manualmente

1. Haz clic en **"Google Drive"**
2. Selecciona **"Guardar en Drive"** para subir tus datos
3. Selecciona **"Cargar desde Drive"** para descargar tus datos

### Auto-Save (Automático)

El CRM guarda automáticamente en Google Drive cuando:
- ✅ Cierras la pestaña del navegador
- ✅ Cierras el navegador
- ✅ Navegas a otra página

Los datos también se cargan automáticamente al iniciar si:
- ✅ Ya estás conectado a Google Drive
- ✅ Hay datos guardados en Drive más recientes que en localStorage

---

## 🔐 Permisos Solicitados

El CRM solicita estos permisos mínimos:

```
https://www.googleapis.com/auth/drive.file
```

Este permiso permite:
- ✅ Crear y editar archivos creados por esta aplicación
- ❌ NO puede acceder a otros archivos en tu Google Drive
- ✅ Solo guarda/lee el archivo `merka-crm-data.json`

---

## 📂 Estructura de Datos en Google Drive

El CRM guarda un archivo llamado `merka-crm-data.json` en la carpeta **"App Data"** de tu Google Drive. Este archivo contiene:

```json
{
  "projects": [...],
  "leads": [...],
  "customFields": [...],
  "pipelineStages": [...]
}
```

---

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"

**Causa**: Los orígenes autorizados no coinciden con tu dominio.

**Solución**:
1. Ve a Google Cloud Console → Credentials
2. Edita tu OAuth Client ID
3. Agrega tu dominio actual a **"Authorized JavaScript origins"**
4. Agrega tu dominio a **"Authorized redirect URIs"**
5. Guarda y espera 1-2 minutos para que se propague el cambio

### Error: "API key not valid"

**Causa**: La API Key no es correcta o no tiene los permisos necesarios.

**Solución**:
1. Verifica que la API Key sea correcta
2. Asegúrate de que Google Drive API esté habilitada
3. Regenera la API Key si es necesario

### Error: "403 Forbidden"

**Causa**: El usuario no ha otorgado los permisos necesarios.

**Solución**:
1. Desconecta y vuelve a conectar tu cuenta de Google
2. Asegúrate de aceptar todos los permisos solicitados

### Los datos no se sincronizan automáticamente

**Causa**: El navegador puede bloquear el auto-save.

**Solución**:
1. Haz una sincronización manual: Google Drive → Guardar en Drive
2. Verifica que no haya errores en la consola del navegador (F12)
3. Asegúrate de estar conectado a Google

---

## 🔒 Seguridad

- ✅ Los datos se encriptan en tránsito (HTTPS)
- ✅ Solo tu cuenta puede acceder a los datos
- ✅ El archivo se guarda en una carpeta privada (App Data)
- ✅ No se comparten datos con terceros
- ✅ Puedes revocar el acceso en cualquier momento desde tu cuenta de Google

### Revocar Acceso

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Selecciona **"Third-party apps & services"**
3. Encuentra "CRM Migrante"
4. Haz clic en **"Remove Access"**

---

## 💡 Consejos de Uso

### Para Trabajo en Equipo

Cada miembro del equipo debe:
1. Configurar su propia cuenta de Google
2. El archivo en Drive es **privado por usuario**
3. Para compartir datos entre usuarios, usa la opción **"Exportar Backup Local"** y comparte el archivo JSON

### Para Backup Adicional

Además de Google Drive:
1. Usa **"Exportar Backup Local"** regularmente
2. Guarda los archivos JSON en una carpeta segura
3. Puedes restaurar desde estos archivos en cualquier momento

### Para Cambiar de Computadora

1. Conecta tu cuenta de Google en la nueva computadora
2. Los datos se cargarán automáticamente desde Drive
3. ¡Sin necesidad de transferir archivos manualmente!

---

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa los errores en la consola del navegador (F12 → Console)
2. Verifica que las variables de entorno estén configuradas correctamente
3. Asegúrate de que Google Drive API esté habilitada
4. Revisa los orígenes autorizados en Google Cloud Console

---

## 🔄 Futuras Mejoras

- [ ] Sincronización en tiempo real (WebSocket)
- [ ] Historial de cambios
- [ ] Restaurar versiones anteriores
- [ ] Compartir proyectos entre usuarios
- [ ] Notificaciones push de nuevos leads
