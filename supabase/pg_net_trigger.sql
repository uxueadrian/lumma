-- 1. Enable pg_net extension (Supabase already has it available)
create extension if not exists pg_net with schema extensions;

-- 2. Create a function that sends email via Resend API
--    Uses the secrets already stored in Supabase: RESEND_API_KEY and TO_EMAIL
create or replace function public.handle_new_lead()
returns trigger
language plpgsql
as $$
begin
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', current_setting('app.settings.resend_api_key'))
    ),
    body := jsonb_build_object(
      'from', 'Thalex Systems <onboarding@resend.dev>',
      'to', jsonb_build_array(current_setting('app.settings.to_email')),
      'subject', concat('Nueva solicitud de cotización - ', NEW.nombre),
      'html', format(
        '<h2>Nueva solicitud de cotización - Thalex Systems</h2>
         <table border="0" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
           <tr><td><strong>Nombre:</strong></td><td>%s</td></tr>
           <tr><td><strong>Correo:</strong></td><td>%s</td></tr>
           <tr><td><strong>Teléfono:</strong></td><td>%s</td></tr>
           <tr><td><strong>Servicio solicitado:</strong></td><td>%s</td></tr>
           <tr><td><strong>Presupuesto:</strong></td><td>%s</td></tr>
           <tr><td><strong>Mensaje:</strong></td><td>%s</td></tr>
           <tr><td><strong>Fecha:</strong></td><td>%s</td></tr>
         </table>',
        NEW.nombre,
        NEW.correo,
        coalesce(NEW.telefono, 'No proporcionado'),
        coalesce(NEW.servicio, 'No especificado'),
        coalesce(NEW.presupuesto, 'No especificado'),
        NEW.mensaje,
        to_char(now(), 'DD/MM/YYYY HH24:MI')
      )
    )
  );
  return NEW;
end;
$$;

-- 3. Create the trigger on leads table
drop trigger if exists on_lead_inserted on public.leads;
create trigger on_lead_inserted
  after insert on public.leads
  for each row
  execute function public.handle_new_lead();

-- 4. Set the secrets as session parameters
--    (First, create the settings schema if needed)
--    IMPORTANT: Replace the placeholder values below with your actual secrets
select set_config('app.settings.resend_api_key', 're_XXX', false);
select set_config('app.settings.to_email', 'adrianuxuechavezmartinez@gmail.com', false);
