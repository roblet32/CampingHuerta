# 🏕️ CampingHuerta

Plataforma web full-stack de reservaciones para un sitio de ecoturismo en México. Permite a los visitantes explorar espacios disponibles, registrarse, realizar reservas y gestionar su perfil. Incluye un panel de administración completo para gestionar espacios, clientes y reservaciones de forma manual.

---

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Lenguaje | **TypeScript 5** |
| UI | **React 19** + **Tailwind CSS v4** |
| Base de Datos | **PostgreSQL** (via Supabase) |
| ORM | **Prisma 5** |
| Auth | Custom JWT con **jose** + **bcryptjs** |
| Emails | **Resend** |
| Mapas | **Leaflet** + **react-leaflet** |
| Testing | **Playwright** (E2E) |
| Deploy | **Vercel** (frontend) + **Supabase** (DB con PgBouncer) |

---

## 📁 Estructura de Páginas

### Área Pública
| Ruta | Descripción |
|---|---|
| `/` | Landing page con hero y vista previa de espacios |
| `/espacios` | Catálogo de espacios disponibles para reservar |
| `/registro` | Flujo de reserva y registro de usuario |
| `/login` | Autenticación de usuarios |
| `/perfil` | Gestión del perfil y reservas del usuario |
| `/galeria` | Galería de imágenes del camping |
| `/nosotros` | Información del negocio |
| `/contacto` | Datos de contacto |
| `/forgot-password` | Solicitud de recuperación de contraseña |
| `/reset-password` | Restablecimiento de contraseña |
| `/new-verification` | Verificación de email |

### Panel de Administración (rol `ADMIN`)
| Ruta | Descripción |
|---|---|
| `/admin/login` | Login exclusivo del administrador |
| `/admin` | Dashboard principal con métricas |
| `/admin/reservas` | Gestión de reservaciones (aprobar/rechazar/confirmar pago) |
| `/admin/espacios` | CRUD de espacios del camping |
| `/admin/clientes` | Listado de clientes registrados |
| `/admin/configuracion` | Configuración general |
| `/admin/registro-temporal` | Creación manual de reservas por el admin |

### API Routes
| Ruta | Descripción |
|---|---|
| `/api/upload` | Subida de imágenes para los espacios |
| `/api/webhooks` | Webhooks para integraciones externas |

---

## 🗄️ Modelos de Base de Datos

- **User** — `id`, `email` (único), `password` (hasheada), `name`, `role` (`USER` \| `ADMIN`), `emailVerified`
- **Space** — `id`, `name`, `description`, `price`, `capacity`, `type` (`PARKING` \| `OPEN_FIELD` \| `PALAPA` \| `RIVERSIDE` \| `HOUSE`), `images[]`, `isAvailable`
- **Reservation** — `id`, `startDate`, `endDate`, `guests`, `status` (`PENDING` \| `APPROVED` \| `PAID` \| `REJECTED` \| `CANCELLED`), FK `userId`, FK `spaceId`
- **VerificationToken** — Para verificación de email
- **PasswordResetToken** — Para recuperación de contraseña

---

## 🔐 Autenticación

- Autenticación custom (**sin** NextAuth) con sesiones JWT firmadas con `jose` (HS256)
- Dos cookies separadas: `client_session` y `admin_session` (según el rol)
- Contraseñas hasheadas con `bcryptjs`
- Sesiones con expiración de **24 horas**
- Flujo completo de verificación de email y recuperación de contraseña vía **Resend**
- RBAC: roles `USER` y `ADMIN`, rutas protegidas por middleware/proxy

---

## 🌐 Variables de Entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | PostgreSQL con connection pooler (Supabase, puerto 6543) |
| `DIRECT_URL` | Conexión directa a PostgreSQL (puerto 5432) |
| `SESSION_SECRET` | Secreto para firmar los JWT de sesión |
| `RESEND_API_KEY` | API key de Resend para emails transaccionales |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp del negocio |
| `NEXT_PUBLIC_FACEBOOK_URL` | URL de la página de Facebook |
| `CONTACT_EMAIL` | Email de contacto del negocio |

---

## 🚀 Instalación y Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Generar el cliente de Prisma y aplicar migraciones
npx prisma generate
npx prisma db push

# 4. Poblar la base de datos con datos iniciales
npx prisma db seed

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Testing

```bash
# Ejecutar tests End-to-End con Playwright
npm run test:e2e
```

---

## ☁️ Despliegue

La aplicación está configurada para desplegarse en:

- **Frontend** → [Vercel](https://vercel.com)
- **Base de datos** → [Supabase](https://supabase.com) (PostgreSQL con PgBouncer)

Asegúrate de configurar todas las variables de entorno en el dashboard de Vercel antes de desplegar.
