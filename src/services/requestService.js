let pendingService = null

const listeners = new Set()

export function requestService(id) {
  pendingService = id
  listeners.forEach((listener) => listener(id))
  scrollToContact()
}

export function getPendingService() {
  return pendingService
}

export function subscribeToServiceSelection(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function scrollToContact() {
  const section = document.getElementById('contact')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
