# 📦 Proyecto CRM Migrante - Instrucciones para Subir a GitHub

## 📥 Descargar el Proyecto

El archivo comprimido está disponible en:
```
download/my-project.zip (26MB)
```

---

## 🚀 Instrucciones para Subir a GitHub

### Paso 1: Descomprimir el proyecto

```bash
# Descomprimir el archivo
unzip my-project.zip

# Entrar al directorio
cd my-project
```

### Paso 2: Inicializar Git

```bash
# Inicializar repositorio git
git init

# Configurar tu nombre de usuario (solo primera vez)
git config user.name "Tu Nombre"

# Configurar tu email (solo primera vez)
git config user.email "tu@email.com"
```

### Paso 3: Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio (por ejemplo: `crm-migrante`)
3. **NO marques** "Initialize this repository with a README"
4. Crea el repositorio

### Paso 4: Conectar y Subir

```bash
# Agregar el remoto (reemplaza con tu usuario y nombre del repo)
git remote add origin https://github.com/TU_USUARIO/crm-migrante.git

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: CRM Migrante v5.3"

# Cambiar a la rama main (si estás en master)
git branch -M main

# Subir a GitHub
git push -u origin main
```

### Paso 5: Instalar Dependencias (al clonar en otra PC)

```bash
# Instalar dependencias
bun install

# Crear archivo .env
cp .env.example .env

# Configurar la base de datos
bun run db:push

# Iniciar el servidor de desarrollo
bun run dev
```

---

## 📋 Archivos Incluidos

El proyecto incluye:

### ✅ Código Fuente
- `src/app/page.tsx` - Página principal con el CRM
- `src/components/MerkaCRM.tsx` - Componente principal del CRM
- `src/components/GoogleDriveSync.tsx` - Componente de backup
- `src/types/crm.ts` - Definiciones de tipos TypeScript

### ✅ API Routes
- `src/app/api/public/lead/route.ts` - Endpoint para crear leads
- `src/app/api/public/lead/[id]/route.ts` - Endpoint para actualizar/eliminar leads

### ✅ Formulario Público
- `src/app/formulario/page.tsx` - Página de formulario de contacto

### ✅ Base de Datos
- `prisma/schema.prisma` - Esquema de base de datos
- Soporta tablas: CRMProject, CRMLead, User, Post

### ✅ Configuración
- `next.config.ts` - Configuración de Next.js
- `tailwind.config.ts` - Configuración de Tailwind CSS
- `tsconfig.json` - Configuración de TypeScript
- `components.json` - Configuración de shadcn/ui

### ✅ Dependencias
- `package.json` - Todas las dependencias configuradas
- `bun.lock` - Lockfile de Bun

---

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Base de datos
DATABASE_URL="file:../db/custom.db"
```

---

## 🎯 Características del CRM

### ✅ Funcionalidades Principales

1. **Gestión de Leads**
   - Leads siempre caen a la PRIMERA fase del pipeline
   - Soporte para múltiples etapas personalizables
   - Cards con información detallada del lead

2. **Múltiples Proyectos**
   - Cada proyecto tiene su propio link de formulario
   - Links únicos: `/formulario?p={projectId}`
   - Compartible por WhatsApp, email, etc.

3. **Formulario Público**
   - Captura leads desde una página pública
   - Los leads se guardan en la base de datos
   - Pueden importarse al CRM local

4. **Usuarios y Permisos**
   - Roles: Admin, Vendedor, Solo Lectura
   - Múltiples usuarios pueden acceder simultáneamente
   - Login con credenciales locales

5. **Backup y Sincronización**
   - Exportar/Importar backups en formato JSON
   - Compatible con Google Drive (subiendo el archivo)
   - Preserva todos los datos del sistema

6. **Exportación de Datos**
   - Soporta CSV, Excel (XLSX) y PDF
   - Filtros por fechas
   - Incluye todos los datos de los leads

---

## 📝 Credenciales por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin | Administrador |
| vendedor | vendedor | Vendedor |
| viewer | viewer | Solo Lectura |

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción

---

## 🌐 Deploy Recomendado

### Opción 1: Vercel (Recomendado para Next.js)

```bash
# Instalar Vercel CLI
bun install -g vercel

# Hacer deploy
vercel
```

### Opción 2: Docker

```bash
# Construir imagen
docker build -t crm-migrante .

# Correr contenedor
docker run -p 3000:3000 crm-migrante
```

### Opción 3: VPS (DigitalOcean, AWS, etc.)

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/crm-migrante.git
cd crm-migrante

# Instalar dependencias
bun install

# Configurar producción
bun run build
bun run start
```

---

## 📚 Documentación

### API Endpoints

#### Crear Lead (Formulario Público)
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

#### Obtener Leads del Proyecto
```http
GET /api/public/lead?p={projectId}&imported=false
```

#### Marcar Lead como Importado
```http
PATCH /api/public/lead/{leadId}
Content-Type: application/json

{
  "imported": true
}
```

#### Eliminar Lead
```http
DELETE /api/public/lead/{leadId}
```

---

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules
bun install
```

### Error de Base de Datos
```bash
# Resetear base de datos
rm -f db/custom.db
bun run db:push
```

### Puerto 3000 ya está en uso
```bash
# Cambiar puerto en package.json o matar el proceso
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Soporte

- WhatsApp: +506 6449 8045
- Email: soporte@ejemplo.com

---

## 📄 Licencia

Este proyecto es propiedad exclusiva. Todos los derechos reservados.

---

## 🔄 Actualizaciones Futuras

Para recibir actualizaciones del repositorio en GitHub:

```bash
# Desde el directorio del proyecto clonado
git pull origin main

# Instalar nuevas dependencias si las hay
bun install
```
