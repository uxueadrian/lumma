# Lumma - Project Brief

## Stack
- Frontend: React 19 + Vite 6 + Tailwind CSS 3
- Backend: Supabase (PostgreSQL, Edge Functions)
- Email: Resend
- Hosting: Vercel (frontend), Supabase (backend)

## Status (30 Jul 2026)
- [x] Landing page con React + Tailwind
- [x] Formulario guarda leads en Supabase (RLS anon_insert)
- [x] Edge Function `resend-email` desplegada en Supabase
- [x] Secrets en Supabase: RESEND_API_KEY, TO_EMAIL
- [x] Repo en GitHub: https://github.com/uxueadrian/lumma
- [x] Deployado en Vercel
- [ ] **Pendiente:** Comprar dominio y verificarlo en Resend
- [ ] **Pendiente:** Cambiar `from` en edge function de `onboarding@resend.dev` a dominio propio

## Edge Function
- Slug: `resend-email`
- Entrypoint: `index.ts` (JS real)
- Verify JWT: false
- Ambas en Supabase secrets

## Contacto usuario
- Email: adrianuxuechavezmartinez@gmail.com
- GitHub: uxueadrian
- WhatsApp: 7772597109
