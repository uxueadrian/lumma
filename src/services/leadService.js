import { supabase } from '../config/supabase'

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resend-email`

export async function submitLead(leadData) {
  const { error } = await supabase.from('leads').insert([leadData])

  if (error) {
    console.error('Error submitting lead:', error)
    throw new Error(error.message)
  }

  try {
    await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(leadData),
    })
  } catch (emailError) {
    console.error('Error sending email notification:', emailError)
  }
}
