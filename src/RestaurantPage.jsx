import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Clock3, MapPin, Phone, UtensilsCrossed } from 'lucide-react'

const weekdayMenu = [
  {
    day: 'Lundi',
    dish: 'Watafufu & eru',
    image: '01_Lundi_Watafufu_and_eru.png',
    description: 'Watafufu accompagné de la sauce eru.',
  },
  {
    day: 'Mardi',
    dish: 'Macaronis sautés',
    image: '02_Mardi_Macaronis_sautes.png',
    description: 'Macaronis sautés, préparés maison.',
  },
  {
    day: 'Mercredi',
    dish: 'Mbongo tchobi',
    image: '16_Mbongo_miachoirons_genere.png',
    description: 'Mbongo tchobi ou mbongo machoirons.',
  },
  {
    day: 'Jeudi',
    dish: 'Ndolé sentimental',
    image: '04_Jeudi_Ndole_sentimental_aux_oignons.png',
    description: 'Ndolé sentimental aux oignons.',
  },
  {
    day: 'Vendredi',
    dish: 'Spécial fried rice',
    image: '05_Vendredi_Special_fried_rice.png',
    description: 'Riz sauté façon maison.',
  },
]

const madeToOrderMenu = [
  ['Poisson à la poêle', '3 500 FCFA'],
  ['Rognons sautés', '6 000 FCFA'],
  ['Lapin chasseur (1/4)', '7 500 FCFA'],
  ['Burger', '1 000 FCFA'],
  ['Pizza de poulet', '7 000 FCFA'],
  ['Pizza viande de bœuf', '7 000 FCFA'],
  ['Lapin entier', '15 000 FCFA'],
  ['Poulet pané entier', '12 000 FCFA'],
  ['Poulet rôti entier', '12 000 FCFA'],
]

const aLaCarteDishes = [
  'Poulet pané',
  'Poulet DG',
  'Poulet mayo',
  'DG au poulet et pommes de terre',
  'DG au bœuf et pommes de terre',
  'Rôti de tripes flottées à l’ail',
]

const accompaniments = [
  'Frites de plantain et de pommes',
  'Riz vapeur',
  'Manioc',
  'Plantain mûr vapeur',
]

function RestaurantPage() {
  useEffect(() => {
    document.title = 'Le Mont Royal Resto | Menu du jour à Bafoussam'
  }, [])

  return (
    <div className="restaurant-page">
      <header className="restaurant-page-header">
        <div className="restaurant-page-nav">
          <a className="restaurant-page-brand" href="/" aria-label="Le Mont Royal, accueil">
            <img src="/images/00_LE_MONT_ROYAL_logo_wordmark.png" alt="Le Mont Royal Resto" />
          </a>
          <nav className="restaurant-page-links" aria-label="Navigation du restaurant">
            <a href="#menu">Menu du jour</a>
            <a href="#a-la-carte">À la carte</a>
            <a href="#infos-pratiques">Nous trouver</a>
          </nav>
          <a className="restaurant-order-link" href="https://wa.me/237690338270?text=Bonjour%20Le%20Mont%20Royal%2C%20je%20souhaite%20commander." target="_blank" rel="noreferrer">
            <Phone size={16} /> Commander
          </a>
        </div>
      </header>

      <main>
        <section className="restaurant-hero">
          <div className="restaurant-hero-inner">
            <div className="restaurant-hero-copy">
              <a className="restaurant-back-link" href="/#restaurant"><ArrowLeft size={15} /> Retour au Mont Royal</a>
              <p className="restaurant-eyebrow"><span /> Restaurant africain · Bafoussam</p>
              <h1>Le goût du naturel <em>dans votre assiette.</em></h1>
              <p className="restaurant-hero-description">Une cuisine africaine généreuse, préparée maison et servie avec soin au cœur d’Akwa.</p>
              <div className="restaurant-hero-actions">
                <a className="restaurant-primary-action" href="#menu">Découvrir le menu <ArrowRight size={16} /></a>
                <a className="restaurant-secondary-action" href="tel:+237690338270"><Phone size={15} /> +237 690 33 82 70</a>
              </div>
              <div className="restaurant-hero-facts">
                <div><UtensilsCrossed size={17} /><span>Cuisine faite maison</span></div>
                <div><Clock3 size={17} /><span>Plat du jour en semaine</span></div>
              </div>
            </div>
            <figure className="restaurant-hero-visual">
              <img src="/images/17_Poulet_DG_genere.png" alt="Poulet DG aux légumes et pommes de terre" />
              <figcaption><span>La cuisine du Mont Royal</span><strong>Saveurs · Qualité · Fraîcheur</strong></figcaption>
            </figure>
          </div>
        </section>

        <section className="restaurant-menu-section" id="menu">
          <div className="restaurant-content-wrap">
            <div className="restaurant-section-heading">
              <div>
                <p className="restaurant-section-kicker">Du lundi au vendredi</p>
                <h2>Les plats du jour</h2>
              </div>
              <p>Chaque jour, une spécialité maison préparée avec les accompagnements du moment.</p>
            </div>

            <div className="restaurant-day-grid">
              {weekdayMenu.map((item) => (
                <article className="restaurant-day-card" key={item.day}>
                  <div className="restaurant-day-image">
                    <img src={`/images/${item.image}`} alt={item.dish} loading="lazy" />
                    <span>{item.day}</span>
                  </div>
                  <div className="restaurant-day-copy">
                    <h3>{item.dish}</h3>
                    <p>{item.description}</p>
                    <div className="restaurant-price-row">
                      <span>Plat du jour</span>
                      <strong>1 500 – 2 000 <small>FCFA</small></strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="restaurant-everyday-dish">
              <img src="/images/06_Tous_les_jours_Eminces_de_viande_de_boeuf.png" alt="Émincés de viande de bœuf" loading="lazy" />
              <div>
                <p className="restaurant-section-kicker">Également au menu</p>
                <h3>Émincés de viande de bœuf</h3>
                <p>Une spécialité proposée tous les jours.</p>
              </div>
              <span className="restaurant-everyday-label">Tous les jours</span>
            </div>

            <div className="restaurant-weekend-panel">
              <img src="/images/07_Samedi_Dimanche_Taro_et_bouillon.png" alt="Taro et bouillon, spécialité du week-end" loading="lazy" />
              <div>
                <p className="restaurant-section-kicker">Samedi & dimanche</p>
                <h3>À la carte, et taro-bouillon sur commande</h3>
                <p>Le week-end, les plats du jour laissent place aux spécialités à la carte. Pensez à commander le taro et le bouillon à l’avance.</p>
              </div>
              <a href="https://wa.me/237690338270?text=Bonjour%20Le%20Mont%20Royal%2C%20je%20souhaite%20commander%20le%20taro%20et%20bouillon." target="_blank" rel="noreferrer" aria-label="Commander le taro et bouillon sur WhatsApp"><ArrowRight size={20} /></a>
            </div>
          </div>
        </section>

        <section className="restaurant-a-la-carte" id="a-la-carte">
          <div className="restaurant-content-wrap restaurant-a-la-carte-grid">
            <div className="restaurant-a-la-carte-intro">
              <p className="restaurant-section-kicker">Selon vos envies</p>
              <h2>La carte du Resto</h2>
              <p>Des classiques généreux à savourer sur place ou à commander. Les tarifs des plats à la carte sont communiqués par l’équipe.</p>
              <div className="restaurant-dish-list">
                {aLaCarteDishes.map((dish) => <span key={dish}>{dish}</span>)}
              </div>
              <div className="restaurant-accompaniments">
                <h3>Nos accompagnements</h3>
                <p>{accompaniments.join(' · ')}</p>
              </div>
            </div>

            <div className="restaurant-order-menu">
              <div className="restaurant-order-menu-heading">
                <p className="restaurant-section-kicker">À prévoir à l’avance</p>
                <h3>Menus sur commande</h3>
              </div>
              <ul>
                {madeToOrderMenu.map(([dish, price]) => (
                  <li key={dish}><span>{dish}</span><strong>{price}</strong></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="restaurant-contact-section" id="infos-pratiques">
          <div className="restaurant-content-wrap restaurant-contact-inner">
            <div>
              <p className="restaurant-section-kicker">Nous rendre visite</p>
              <h2>Le Mont Royal Resto</h2>
              <p className="restaurant-contact-address"><MapPin size={19} /> Akwa, face Maison des Vestes<br />Bafoussam, Cameroun</p>
            </div>
            <div className="restaurant-contact-actions">
              <a href="tel:+237690338270"><Phone size={17} /> Appeler le 690 33 82 70</a>
              <a href="https://wa.me/237690338270?text=Bonjour%20Le%20Mont%20Royal%2C%20je%20souhaite%20commander." target="_blank" rel="noreferrer">Commander sur WhatsApp <ArrowRight size={16} /></a>
              <a href="https://www.google.com/maps/search/?api=1&query=Bafoussam%20Akwa%20face%20Maison%20des%20Vestes" target="_blank" rel="noreferrer">Voir l’itinéraire <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="restaurant-page-footer">
        <span>© {new Date().getFullYear()} Le Mont Royal · Bafoussam</span>
        <a href="/#restaurant">Retour au site principal <ArrowRight size={14} /></a>
      </footer>
    </div>
  )
}

export default RestaurantPage