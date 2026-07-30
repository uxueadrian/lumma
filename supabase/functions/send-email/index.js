import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TO_EMAIL = Deno.env.get('TO_EMAIL') || 'thalexsystems@gmail.com'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  try {
    const { nombre, correo, telefono, servicio, presupuesto, mensaje } = await req.json()

    const emailHtml = `
      <h2>Nueva solicitud de cotizaci&oacute;n - Thalex Systems</h2>
      <table border="0" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><td><strong>Nombre:</strong></td><td>${nombre}</td></tr>
        <tr><td><strong>Correo:</strong></td><td>${correo}</td></tr>
        <tr><td><strong>Tel&eacute;fono:</strong></td><td>${telefono || 'No proporcionado'}</td></tr>
        <tr><td><strong>Servicio solicitado:</strong></td><td>${servicio || 'No especificado'}</td></tr>
        <tr><td><strong>Presupuesto:</strong></td><td>${presupuesto || 'No especificado'}</td></tr>
        <tr><td><strong>Mensaje:</strong></td><td>${mensaje}</td></tr>
        <tr><td><strong>Fecha:</strong></td><td>${new Date().toLocaleString('es-MX')}</td></tr>
      </table>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Thalex Systems <contacto@thalexsystems.cloud>',
        to: [TO_EMAIL],
        subject: `Nueva solicitud de cotizaci&oacute;n - ${nombre}`,
        html: emailHtml,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Email sent' }), {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }
})
