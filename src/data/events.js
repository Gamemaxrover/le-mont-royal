export const featuredEvent = {
  title: 'All Black Party',
  description: 'Une nuit dédiée à l’élégance, à la musique et aux rencontres dans une ambiance entièrement noire. Rendez-vous au Mont Royal à Bafoussam Akwa dès 20H.',
  dateTime: '2026-11-07T20:00:00+01:00',
  location: 'Bafoussam Akwa, face Maison des Vestes',
  phones: ['690109141', '693948008'],
  eventModeDurationHours: 24,
}

export function isEventWindowActive(timestamp, event = featuredEvent) {
  const start = new Date(event.dateTime).getTime()
  const end = start + event.eventModeDurationHours * 60 * 60 * 1000
  return timestamp >= start && timestamp < end
}