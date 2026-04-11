# Guía de Configuración para Vercel

## ⚠️ IMPORTANTE: Base de Datos Requerida

Vercel NO soporta bases de datos SQLite (archivos locales). Necesitas configurar una base de datos en la nube.

---

## 🚀 Opción 1: Vercel Postgres (Más Fácil)

### Pasos:

1. **Crear la base de datos en Vercel:**
   - Ve a: https://vercel.com/dashboard
   - Selecciona tu proyecto: `CRM_Migrante_V3`
   - Ve a: **Storage** → **Create Database**
   - Selecciona: **Postgres**
   - Haz clic en **Continue** y **Create Database**

2. **Obtener el Connection String:**
   - En la página de la base de datos, ve a: **.env.local** tab
   - Copia el valor de `DATABASE_URL`
   - Se ve algo como: `postgresql://user:password@host/dbname?schema=public`

3. **Configurar en Vercel:**
   - Ve a: **Settings** → **Environment Variables**
   - Agrega esta variable:

| Nombre | Valor | Environment |
|--------|-------|-------------|
| `DATABASE_URL` | (el connection string que copiaste) | All |

4. **Inicializar la base de datos:**
   - Ve a: **Storage** → tu base de datos
   - Haz clic en **Query**
   - Ejecuta esto para crear las tablas automáticamente (el schema ya está en el código):
   ```
   -- Las tablas se crearán automáticamente cuando la app se conecte
   ```

---

## 🆓 Opción 2: Supabase (Gratuito)

### Pasos:

1. **Crear cuenta en Supabase:**
   - Ve a: https://supabase.com/
   - Regístrate con tu cuenta de GitHub
   - Crea un **New Project**
   - Nombre: `crm-migrante`
   - Database Password: (guarda esta contraseña)
   - Región: selecciona la más cercana a ti

2. **Obtener el Connection String:**
   - Ve a: **Settings** → **Database**
   - En la sección **Connection String**, copia la versión **URI**
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña real

3. **Configurar en Vercel:**
   - Ve a: https://vercel.com/dashboard → tu proyecto
   - **Settings** → **Environment Variables**
   - Agrega:

| Nombre | Valor | Environment |
|--------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres` | All |

---

## 🌐 Opción 3: PlanetScale (Gratuito, MySQL)

### Pasos:

1. **Crear cuenta en PlanetScale:**
   - Ve a: https://planetscale.com/
   - Crea un nuevo proyecto: `crm-migrante`
   - Crea una base de datos: `crm`

2. **Obtener el Connection String:**
   - Ve a: **Connect** → **General**
   - Selecciona **Prisma**
   - Copia el `.env` connection string

3. **Actualizar schema.prisma para MySQL:**
   Cambia en `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"  // Cambiar de "postgresql" a "mysql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Configurar en Vercel:**
   Agrega el connection string como variable de entorno `DATABASE_URL`

---

## 🔧 Variables de Entorno Completas

Además de `DATABASE_URL`, necesitas configurar:

### Para Google Drive:

| Nombre | Valor | Environment |
|--------|-------|-------------|
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `232167969183-feen9e4pk66nrho8mqo4qh4ju7l7j4vi.apps.googleusercontent.com` | All |

### Para Google Cloud (opcional, si tienes API Key):

| Nombre | Valor | Environment |
|--------|-------|-------------|
| `NEXT_PUBLIC_GOOGLE_API_KEY` | (tu Google API Key) | All |

---

## ✅ Después de Configurar

1. **Redesplegar la app:**
   - Ve a: **Deployments** en Vercel
   - Haz clic en los tres puntos (...) del deployment más reciente
   - Selecciona **Redeploy**

2. **Verificar que funciona:**
   - Abre: https://crm-migrante-v3.vercel.app/
   - Deberías ver: **"CRM MIGRANTE v8.0 - 10/04/2026"**
   - Crea un proyecto
   - El botón de **Google Drive** debería aparecer arriba a la derecha

---

## 📝 Notas Importantes

### Sobre la Versión:
- La versión **v8.0** incluye:
  - Botón de Google Drive siempre visible
  - Soporte para exportar PDF
  - Soporte para importar Excel
  - Configuración para Vercel con Bun
  - Schema actualizado para PostgreSQL

### Sobre los Leads:
- Los leads del formulario público se guardan en la base de datos
- Los leads caen automáticamente a la **primera fase** del pipeline
- Puedes importar leads desde archivos CSV, Excel o JSON

### Sobre Google Drive:
- El botón de login ahora SIEMPRE aparece
- Si no está configurado, muestra instrucciones paso a paso
- Necesitas agregar el dominio `https://crm-migrante-v3.vercel.app` en Google Cloud Console

---

## 🐛 Solución de Problemas

### Error: "Database connection failed"
- Verifica que la variable `DATABASE_URL` esté configurada en Vercel
- Verifica que la base de datos exista y esté activa
- Prueba la conexión desde el panel de la base de datos

### Error: "Table does not exist"
- Las tablas se crean automáticamente cuando la app se conecta por primera vez
- Si persiste, verifica el schema en `prisma/schema.prisma`

### Los leads no aparecen en el CRM
- Verifica que estés usando la base de datos correcta
- Recarga la página después de crear un proyecto
- Verifica que el proyecto exista en la base de datos

### Google Drive no conecta
- Verifica que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` esté configurada en Vercel
- Verifica que el dominio esté agregado en Google Cloud Console como Authorized Redirect URI
- Después de agregar variables de entorno, haz un redeploy

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Vercel: **Deployments** → selecciona el deployment → **Build Log**
2. Revisa los logs de la base de datos en el panel correspondiente
3. Verifica que todas las variables de entorno estén configuradas

---

**Última actualización:** 10/04/2026
**Versión del CRM:** v8.0
