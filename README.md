# Proyecto Música

Gestión de canciones y artistas con API REST e interfaz web.

## Tecnologías
Express, Prisma, SQLite · React, Vite · Git, GitHub, Render

## Estructura
- backend/   API Express + Prisma + SQLite
- frontend/  Interfaz React + Vite

## Ejecución en local
Backend: copiar backend/.env.example a backend/.env, npm install, npx prisma migrate dev, npm run dev
Frontend: copiar frontend/.env.example a frontend/.env, npm install, npm run dev

## Variables de entorno
Ver backend/.env.example y frontend/.env.example (sin valores secretos).

## Despliegue
- Frontend:https://musica-web-1kqx.onrender.com
- API:     https://musica-api-fs0l.onrender.com/
- Nota: la base de datos SQLite del plan gratuito es efímera.
