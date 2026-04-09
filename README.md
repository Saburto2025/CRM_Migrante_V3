# 🎯 CRM Migrante v5.4

Sistema de gestión de leads y ventas con integración en tiempo real con Google Drive.

![Version](https://img.shields.io/badge/version-5.4.0-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## ✨ Características

### 🎯 Gestión de Leads
- ✅ Leads **SIEMPRE caen a la primera fase** del pipeline
- ✅ Pipeline visual con fases personalizables
- ✅ Cards con información detallada del lead
- ✅ Movimiento fácil entre etapas
- ✅ Marcar leads como perdidos con razones

### 📁 Múltiples Proyectos
- ✅ Cada proyecto tiene su propio link de formulario
- ✅ Links únicos: `/formulario?p={projectId}`
- ✅ Compartible por WhatsApp, email, redes sociales
- ✅ Colores personalizables por proyecto

### 🌐 Formulario Público
- ✅ Captura leads desde una página pública
- ✅ **Los leads se guardan en localStorage** (funciona en Vercel)
- ✅ Importación automática al CRM
- ✅ **Los leads caen a la PRIMERA fase** automáticamente

### ☁️ Google Drive Integration (NUEVO)
- ✅ **Login con Google** (OAuth 2.0)
- ✅ **Sincronización automática** al cerrar el CRM
- ✅ **Persistencia entre dispositivos**
- ✅ Backup en la nube
- ✅ Cargar datos desde cualquier computadora

### 👥 Usuarios y Permisos
- ✅ Roles: Admin, Vendedor, Solo Lectura
- ✅ Múltiples usuarios pueden acceder simultáneamente
- ✅ Login con credenciales locales o Google

### 📊 Dashboard
- ✅ Métricas en tiempo real
- ✅ Leads por etapa
- ✅ Leads por fuente
- ✅ Tasa de conversión
- ✅ Valor total del pipeline

### 💾 Backup y Sincronización
- ✅ **Sincronización automática con Google Drive**
- ✅ Exportar/Importar backups en formato JSON
- ✅ Compatible con Google Drive
- ✅ Preserva todos los datos del sistema

### 📤 Exportación de Datos
- ✅ Soporta CSV, Excel (XLSX) y PDF
- ✅ Filtros por fechas
- ✅ Incluye todos los datos de los leads

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ (se recomienda usar [Bun](https://bun.sh/))
- Cuenta de Google (opcional, para Drive)
- Cuenta de Vercel (opcional, para deploy)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/crm-migrante.git
cd crm-migrante

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Google (ver sección abajo)

# Inicializar base de datos (opcional, usa localStorage por defecto)
bun run db:push

# Iniciar servidor de desarrollo
bun run dev
```

El CRM estará disponible en `http://localhost:3000`

---

## 🔑 Credenciales por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin | Administrador |
| vendedor | vendedor | Vendedor |
| viewer | viewer | Solo Lectura |

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción

---

## ☁️ Configurar Google Drive

### ¿Por qué configurar Google Drive?

- ✅ Tus datos se guardan automáticamente en la nube
- ✅ Accede desde cualquier computadora
- ✅ Nunca pierdes datos si olvidas hacer backup
- ✅ Sincronización automática al cerrar el CRM

### Pasos para Configurar

1. **Crea un proyecto en Google Cloud Console**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com/)
   - Crea un nuevo proyecto
   - Habilita **Google Drive API**

2. **Crea credenciales OAuth**
   - Ve a **APIs & Services** → **Credentials**
   - Crea un **OAuth Client ID** (Web application)
   - Agrega tu dominio a **Authorized JavaScript origins**
   - Agrega tu dominio a **Authorized redirect URIs**

3. **Obtén tus credenciales**
   - Copia el **Client ID**
   - Crea una **API Key**

4. **Configura en tu proyecto**
   
   Para desarrollo local, crea `.env`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-aqui
   NEXT_PUBLIC_GOOGLE_API_KEY=tu-api-key-aqui
   ```
   
   Para Vercel, agrega las variables en **Settings → Environment Variables**

📖 **Guía completa**: [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md)

---

## 🌐 Deploy en Vercel

### Pasos para Deploy

```bash
# Instalar Vercel CLI
bun install -g vercel

# Hacer deploy
vercel
```

### Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto → **Settings** → **Environment Variables**
3. Agrega estas variables:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id
   NEXT_PUBLIC_GOOGLE_API_KEY=tu-api-key
   DATABASE_URL=file:../db/custom.db
   ```

### Importante sobre Vercel

⚠️ **SQLite no funciona completamente en Vercel** debido a limitaciones del sistema de archivos.

**Solución implementada:**
- El CRM usa **localStorage** como almacenamiento principal
- El formulario público guarda en **localStorage**
- **Google Drive** se usa para sincronización y backup

---

## 📖 Uso del CRM

### 1. Iniciar Sesión

Usa las credenciales por defecto:
- **Usuario**: admin
- **Contraseña**: admin

O conéctate con **Google** para sincronizar tus datos.

### 2. Crear un Proyecto

1. Haz clic en **"Nuevo Proyecto"**
2. Ingresa nombre y descripción
3. Selecciona un color
4. El proyecto se crea y puedes ver su link de formulario

### 3. Obtener el Link del Formulario

1. Selecciona un proyecto
2. Haz clic en **"Formulario"** en la barra superior
3. Verás el link único: `/formulario?p={projectId}`
4. Copia el link o compártelo por WhatsApp

### 4. Recibir Leads del Formulario

1. Los leads que llenan el formulario se guardan automáticamente
2. Haz clic en **"Formulario"** para ver leads pendientes
3. Haz clic en **"Importar"** para llevarlos al CRM
4. **El lead cae a la PRIMERA fase** automáticamente

### 5. Sincronizar con Google Drive

1. Haz clic en el botón **"Google Drive"** en la barra superior
2. Selecciona **"Conectar con Google"**
3. Acepta los permisos
4. Los datos se sincronizan automáticamente:
   - Al cerrar el CRM
   - Al cambiar de pestaña
   - Manualmente: "Guardar en Drive"

---

## 📂 Estructura del Proyecto

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal (CRM)
│   │   ├── formulario/
│   │   │   └── page.tsx          # Formulario público
│   │   ├── api/
│   │   │   └── public/
│   │   │       └── lead/        # API para leads
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── MerkaCRM.tsx         # Componente principal del CRM
│   │   ├── GoogleDriveSync.tsx  # Componente de Google Drive
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── lib/
│   │   ├── db.ts                # Cliente de Prisma
│   │   ├── utils.ts             # Utilidades
│   │   └── google-drive.ts      # Funciones de Google Drive
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   ├── use-mobile.ts
│   │   └── use-google-drive-auto-sync.ts
│   └── types/
│       └── crm.ts               # Definiciones de tipos
├── prisma/
│   └── schema.prisma            # Esquema de base de datos
├── public/                      # Archivos estáticos
├── components.json              # Configuración shadcn/ui
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example                 # Variables de entorno de ejemplo
```

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Base de Datos**: Prisma ORM + SQLite
- **Estado**: React Hooks + LocalStorage
- **Google API**: Google Drive API + OAuth 2.0
- **Exportación**: jsPDF, XLSX, CSV
- **Notificaciones**: Sonner

---

## 🔧 API Endpoints

### Crear Lead (Formulario Público)
```http
POST /api/public/lead
Content-Type: application/json

{
  "projectId": "project-id",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "whatsapp": "+506 60000000",
  "phone": "+506 60000000",
  "company": "Mi Empresa",
  "message": "Mensaje del lead"
}
```

### Obtener Leads del Proyecto
```http
GET /api/public/lead?p={projectId}&imported=false
```

### Marcar Lead como Importado
```http
PATCH /api/public/lead/{leadId}
Content-Type: application/json

{
  "imported": true
}
```

### Eliminar Lead
```http
DELETE /api/public/lead/{leadId}
```

---

## 🐛 Solución de Problemas

### El formulario no funciona

**Causa**: En Vercel, SQLite no es persistente.

**Solución**: El CRM ahora usa localStorage automáticamente. Verifica que el formulario esté enviando datos correctamente en la consola del navegador (F12).

### No puedo conectar con Google Drive

**Causa**: Credenciales incorrectas o orígenes no autorizados.

**Solución**:
1. Verifica que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sea correcto
2. Agrega tu dominio a **Authorized JavaScript origins** en Google Cloud Console
3. Agrega tu dominio a **Authorized redirect URIs**

### Los datos no se sincronizan automáticamente

**Causa**: El navegador puede bloquear el auto-save.

**Solución**:
1. Haz una sincronización manual
2. Verifica que no haya errores en la consola (F12)
3. Asegúrate de estar conectado a Google

### Error: "Module not found"

```bash
rm -rf node_modules
bun install
```

### Puerto 3000 ya está en uso

```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📄 Licencia

Este proyecto es propiedad exclusiva. Todos los derechos reservados.

---

## 📞 Soporte

- WhatsApp: +506 6449 8045
- Email: soporte@ejemplo.com

---

## 🔄 Changelog

### v5.4 (Actual)
- ✅ Integración con Google Drive (OAuth)
- ✅ Sincronización automática al cerrar
- ✅ Login con Google
- ✅ Persistencia entre dispositivos
- ✅ Formulario usa localStorage (funciona en Vercel)
- ✅ Leads caen a la PRIMERA fase siempre
- ✅ Links de formulario por proyecto

### v5.3
- ✅ Sistema de usuarios y permisos
- ✅ Dashboard con métricas
- ✅ Exportación a PDF, Excel, CSV
- ✅ Etapas personalizables

### v5.2
- ✅ Múltiples proyectos
- ✅ Formulario público
- ✅ Importación/Exportación

### v5.1
- ✅ CRM inicial
- ✅ Pipeline visual
- ✅ Gestión de leads
