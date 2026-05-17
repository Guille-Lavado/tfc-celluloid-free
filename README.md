# Celluloid Free

Plataforma web de streaming de cine libre. Descubre, ve y valora películas y
series de forma gratuita, sin suscripciones.

**Demo:** https://react-production-f953.up.railway.app

---

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Backend | Laravel 9, PHP 8.2, MySQL, Sanctum, Backblaze B2 |
| Frontend | React 18, React Router, React Bootstrap, SASS, Axios |
| Infraestructura | Docker, Railway, Git |

---

## Instalación en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Guille-Lavado/tfc-celluloid-free
cd tfc-celluloid-free

# 2. Configurar el entorno
cd backend && cp .env.example .env

# 3. Levantar Docker
docker compose up -d

# 4. Configurar Laravel
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000/api

---

## Despliegue en Railway

1. Crear proyecto en Railway conectado al repositorio de GitHub
2. Añadir servicio **MySQL** desde Railway
3. Añadir servicio de **backend** (Root Directory: `backend`)
4. Añadir servicio de **frontend** (Root Directory: `frontend`)
5. Configurar variables de entorno en cada servicio
6. Generar dominio: `Settings → Networking → Generate Domain`

El archivo `backend/railway.toml` gestiona el despliegue automáticamente.
Cada `git push` a `main` redespliega la aplicación.

---

## Estructura

```
tfg-celluloid-free/
├── backend/          ← API REST (Laravel 9)
│   ├── app/
│   ├── database/
│   ├── routes/api.php
│   └── railway.toml
├── frontend/         ← SPA (React)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── styles/
└── docker-compose.yml
```

---

## Licencia

Trabajo de Fin de Ciclo — Desarrollo de Aplicaciones Web (DAW).
