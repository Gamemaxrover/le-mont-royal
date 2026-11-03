export const drinks = [
  {
    name: "Jack Daniel's Single Barrel",
    category: 'Tennessee whiskey',
    origin: 'États-Unis',
    service: 'À déguster pur ou sur glace',
    shortLabel: 'SINGLE\nBARREL',
    palette: 'charcoal',
    image: '/images/jack-daniels-single-barrel.jpg',
  },
  {
    name: "Grant's 18 ans",
    category: 'Blended Scotch whisky',
    origin: 'Écosse',
    service: 'Pur, pour apprécier ses arômes',
    shortLabel: 'GRANT\'S\n18',
    palette: 'copper',
    image: '/images/grants-18.jpg',
  },
  {
    name: 'Johnnie Walker Blue Label',
    category: 'Blended Scotch whisky',
    origin: 'Écosse',
    service: 'Pur ou avec un trait d’eau',
    shortLabel: 'BLUE\nLABEL',
    palette: 'blue',
  },
  {
    name: 'Hennessy X.O',
    category: 'Cognac',
    origin: 'France',
    service: 'À déguster lentement',
    shortLabel: 'HENNESSY\nX.O',
    palette: 'amber',
    image: '/images/hennessy-xo.jpg',
  },
  {
    name: 'The Macallan Double Cask 12 ans',
    category: 'Single malt Scotch whisky',
    origin: 'Écosse',
    service: 'Pur ou sur un gros glaçon',
    shortLabel: 'MACALLAN\n12',
    palette: 'forest',
    image: '/images/macallan-12.jpg',
  },
  {
    name: 'Rémy Martin X.O',
    category: 'Cognac Fine Champagne',
    origin: 'France',
    service: 'Pur, dans un verre tulipe',
    shortLabel: 'RÉMY\nX.O',
    palette: 'copper',
    image: '/images/remy-martin-xo.jpg',
  },
  {
    name: 'Chivas Regal 18 ans',
    category: 'Blended Scotch whisky',
    origin: 'Écosse',
    service: 'Pur ou sur glace',
    shortLabel: 'CHIVAS\n18',
    palette: 'gold',
    image: '/images/chivas-regal-18.jpg',
  },
  {
    name: 'Moët & Chandon Brut Impérial',
    category: 'Champagne',
    origin: 'France',
    service: 'Servi frais',
    shortLabel: 'MOËT',
    palette: 'champagne',
    image: '/images/placeholder-champagne.jpg',
  },
]

export function getDrinkOfTheDay(timestamp) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Douala',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date(timestamp))
  const date = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const year = Number(date.year)
  const month = Number(date.month)
  const day = Number(date.day)
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000,
  )

  return drinks[(dayOfYear - 1) % drinks.length]
}