# Thalex Systems - Project Brief

## Stack
- Frontend: React 19 + Vite 6 + Tailwind CSS 3
- Backend: Supabase (PostgreSQL, Edge Functions)
- Email: Resend
- Hosting: Vercel (frontend), Supabase (backend)

## Status (30 Jul 2026)
- [x] Landing page con React + Tailwind
- [x] Formulario guarda leads en Supabase (RLS anon_insert)
- [x] Edge Function `resend-email` desplegada en Supabase
- [x] Secrets en Supabase: RESEND_API_KEY, TO_EMAIL=thalexsystems@gmail.com
- [x] Repo en GitHub: https://github.com/uxueadrian/thalexsystems
- [x] Deployado en Vercel
- [x] Dominio thalexsystems.cloud comprado
- [x] Dominio verificado en Resend
- [x] `from` actualizado a `contacto@thalexsystems.cloud`

## Edge Function
- Slug: `resend-email`
- Entrypoint: `index.ts` (JS real)
- Verify JWT: false
- Ambas en Supabase secrets

## Contacto usuario
- Email: thalexsystems@gmail.com
- GitHub: uxueadrian
- WhatsApp: 7772597109
