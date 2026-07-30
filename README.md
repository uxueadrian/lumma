# Lumma - Landing Page

Landing page profesional para agencia de desarrollo web. Construida con React + Vite + Tailwind CSS, con integración a Supabase para gestión de leads.

## Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 3
- **Backend:** Supabase (PostgreSQL, Edge Functions)
- **Email:** Resend API
- **Deploy:** Vercel (frontend), Supabase (backend)

## Funcionalidades

- Formulario de contacto con guardado en Supabase
- Notificación por correo electrónico al administrador via Edge Function + Resend
- Integración con WhatsApp
- Diseño responsive

## Variables de entorno

```env
VITE_SUPABASE_URL=https://alfzdrzjwbhypdjhrtbq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Scripts

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
```
