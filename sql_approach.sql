// Alternative approach: Create a PostgreSQL function that sends the email
// using pg_net extension (which allows making HTTP requests from Postgres)
const SQL = `
-- Enable pg_net extension
create extension if not exists pg_net with schema extensions;

-- Create a function to send email via Resend API
create or replace function public.send_lead_email(
  p_nombre text,
  p_correo text,
  p_telefono text default null,
  p_servicio text default null,
  p_presupuesto text default null,
  p_mensaje text
) returns void
language plpgsql
as $$
declare
  response json;
begin
  select
    net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', concat('Bearer ', current_setting('app.resend_api_key'))
      ),
      body := jsonb_build_object(
        'from', 'Thalex Systems <onboarding@resend.dev>',
        'to', jsonb_build_array(current_setting('app.to_email')),
        'subject', concat('Nueva solicitud de cotizaci&oacute;n - ', p_nombre),
        'html', concat(
          '<h2>Nueva solicitud de cotizaci&oacute;n - Thalex Systems</h2>',
          '<table border="0" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">',
          '<tr><td><strong>Nombre:</strong></td><td>', p_nombre, '</td></tr>',
          '<tr><td><strong>Correo:</strong></td><td>', p_correo, '</td></tr>',
          '<tr><td><strong>Tel&eacute;fono:</strong></td><td>', coalesce(p_telefono, 'No proporcionado'), '</td></tr>',
          '<tr><td><strong>Servicio solicitado:</strong></td><td>', coalesce(p_servicio, 'No especificado'), '</td></tr>',
          '<tr><td><strong>Presupuesto:</strong></td><td>', coalesce(p_presupuesto, 'No especificado'), '</td></tr>',
          '<tr><td><strong>Mensaje:</strong></td><td>', p_mensaje, '</td></tr>',
          '<tr><td><strong>Fecha:</strong></td><td>', to_char(now(), 'DD/MM/YYYY HH24:MI'), '</td></tr>',
          '</table>'
        )
      )
    ) into response;
end;
$$;

-- Set the secrets as session parameters
-- (These should be set in Supabase dashboard > Settings > API > Secrets)
select set_config('app.resend_api_key', 're_XXX', false);
select set_config('app.to_email', 'thalexsystems@gmail.com', false);

-- Create a trigger to send email when a new lead is inserted
create or replace function public.on_lead_inserted()
returns trigger
language plpgsql
as $$
begin
  perform public.send_lead_email(
    new.nombre, new.correo, new.telefono,
    new.servicio, new.presupuesto, new.mensaje
  );
  return new;
end;
$$;

create trigger send_email_on_lead_insert
  after insert on public.leads
  for each row
  execute function public.on_lead_inserted();
`

console.log('SQL to execute in Supabase SQL Editor:')
console.log('')
console.log('NOTE: This approach uses pg_net extension which needs to be enabled.')
console.log('Run the SQL in the Supabase SQL Editor at:')
console.log('https://supabase.com/dashboard/project/alfzdrzjwbhypdjhrtbq/sql/new')
console.log('')
console.log('But first, set the secrets in Supabase Dashboard:')
console.log('Settings > API > Secrets > Add:')
console.log('  - RESEND_API_KEY: your_resend_api_key')
console.log('  - TO_EMAIL: thalexsystems@gmail.com')
