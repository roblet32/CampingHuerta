# CampingHuerta

Plataforma web full-stack para reservas de un sitio de camping/ecoturismo. Permite explorar espacios, registrar clientes, solicitar reservas, verificar correos, recuperar contrasenas y administrar espacios, clientes y reservaciones desde un panel interno.

## Stack

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 16 con App Router |
| Lenguaje | TypeScript 5 |
| UI | React 19 y Tailwind CSS v4 |
| Base de datos | Supabase PostgreSQL |
| ORM | Prisma 5 |
| Auth | Sesiones JWT propias con jose y bcryptjs |
| Correos | Resend |
| Mapas | Leaflet y react-leaflet |
| Testing | Playwright |
| Package manager | pnpm |

## Funcionalidades

### Sitio publico

| Ruta | Descripcion |
|---|---|
| `/` | Pagina principal con hero y vista previa de espacios |
| `/espacios` | Catalogo de espacios disponibles |
| `/espacios/[id]` | Detalle del espacio y widget de reserva |
| `/registro` | Registro de clientes con verificacion por correo |
| `/login` | Login de clientes |
| `/perfil` | Perfil del cliente e historial de reservas |
| `/galeria` | Galeria de imagenes |
| `/nosotros` | Informacion del negocio |
| `/contacto` | Formulario de contacto |
| `/forgot-password` | Solicitud de recuperacion de contrasena |
| `/reset-password` | Restablecimiento de contrasena |
| `/new-verification` | Confirmacion del token de correo |

### Panel de administracion

| Ruta | Descripcion |
|---|---|
| `/admin/login` | Login del administrador |
| `/admin` | Dashboard con metricas y calendario |
| `/admin/reservas` | Gestion de reservaciones |
| `/admin/reservas/nueva` | Creacion manual de reservas |
| `/admin/espacios` | CRUD de espacios |
| `/admin/clientes` | Listado y busqueda de clientes |
| `/admin/configuracion` | Creacion de cuentas administrativas |
| `/admin/registro-temporal` | Creacion del primer admin cuando no existe ninguno |

## Verificacion de correo con Supabase

El proyecto mantiene auth propia, pero usa Supabase como base PostgreSQL para guardar usuarios y tokens mediante Prisma:

- `User.emailVerified` indica si el correo ya fue confirmado.
- `VerificationToken` guarda tokens seguros de verificacion.
- `PasswordResetToken` guarda tokens seguros de recuperacion.
- Los tokens se generan con `crypto.randomBytes`.
- Resend envia los enlaces al usuario.
- El enlace apunta a `NEXT_PUBLIC_BASE_URL/new-verification?token=...`.
- El login de clientes exige que `emailVerified` tenga valor.

Importante: esto no usa Supabase Auth. Si quieres migrar completamente a Supabase Auth, habria que reemplazar el sistema actual de JWT/cookies y adaptar las server actions.

## Variables de entorno

Copia `.env.example` a `.env` y completa tus valores:

```bash
cp .env.example .env
```

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | URL pooled de Supabase PostgreSQL, normalmente puerto `6543` |
| `DIRECT_URL` | URL directa de Supabase PostgreSQL, normalmente puerto `5432` |
| `SESSION_SECRET` | Secreto largo para firmar JWT de sesion |
| `RESEND_API_KEY` | API key de Resend para correos transaccionales |
| `NEXT_PUBLIC_BASE_URL` | URL publica de la app usada en enlaces de correo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero de WhatsApp del negocio |
| `NEXT_PUBLIC_FACEBOOK_URL` | URL de Facebook del negocio |
| `CONTACT_EMAIL` | Correo que recibe mensajes de contacto |

## Instalacion

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma db push
pnpm exec prisma db seed
pnpm run dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm run dev       # servidor local
pnpm run build     # build de produccion
pnpm run start     # ejecutar build
pnpm run lint      # ESLint
pnpm run test:e2e  # Playwright
```

## Modelo de datos

- `User`: usuarios cliente/admin, password hasheado, rol y estado de verificacion.
- `Space`: espacios reservables, precio, capacidad, tipo, imagenes y disponibilidad.
- `Reservation`: reservas por usuario/espacio, fechas, huespedes y estado.
- `VerificationToken`: tokens de activacion de correo.
- `PasswordResetToken`: tokens de recuperacion de contrasena.

## Notas de seguridad

- Las sesiones se guardan en cookies `httpOnly`: `client_session` y `admin_session`.
- Las rutas admin estan protegidas por `src/proxy.ts` y los server actions sensibles tambien validan sesion.
- `/admin/registro-temporal` solo permite crear el primer administrador cuando todavia no existe ninguno.
- No subas `.env` al repositorio. Solo `.env.example` debe versionarse.
- En produccion configura un dominio verificado en Resend para reemplazar `onboarding@resend.dev`.

## Despliegue

La combinacion esperada es:

- Frontend en Vercel.
- Base de datos en Supabase PostgreSQL.
- Correos transaccionales en Resend.

En Vercel configura todas las variables de entorno y asegúrate de que `NEXT_PUBLIC_BASE_URL` apunte al dominio real de produccion.
