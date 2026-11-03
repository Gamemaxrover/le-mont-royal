import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  Expand,
  MapPin,
  Menu,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { featuredEvent, isEventWindowActive } from './data/events.js'
import { drinks, getDrinkOfTheDay } from './data/drinks.js'

const navigation = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Boissons', href: '#boissons' },
  { label: 'Événements', href: '#evenements' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Contact', href: '#contact' },
]

const eventStart = new Date(featuredEvent.dateTime).getTime()
const eventEnd =
  eventStart + featuredEvent.eventModeDurationHours * 60 * 60 * 1000

function getCountdown(target, now) {
  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000))
  return [
    { value: Math.floor(totalSeconds / 86400), label: 'jours' },
    { value: Math.floor((totalSeconds % 86400) / 3600), label: 'heures' },
    { value: Math.floor((totalSeconds % 3600) / 60), label: 'min' },
    { value: totalSeconds % 60, label: 'sec' },
  ]
}

function formatEventDate() {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Douala',
  }).format(new Date(featuredEvent.dateTime))
}

function IconBadge({ icon: Icon, size = 20, compact = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--icon-surface)] text-[var(--icon-ink)] ${compact ? 'size-7' : 'size-10'}`}
      aria-hidden="true"
    >
      <Icon size={size} />
    </span>
  )
}

function DrinkArtwork({ drink }) {
  if (drink.image) {
    return <img className="drink-art drink-art-photo" src={drink.image} alt={`${drink.name}, photo d’illustration`} loading="lazy" />
  }

  return (
    <div className={`drink-art drink-art--${drink.palette}`} role="img" aria-label={`Illustration de bouteille : ${drink.name}`}>
      <div className="drink-bottle">
        <span className="drink-bottle-cap" />
        <span className="drink-bottle-neck" />
        <span className="drink-bottle-body">
          <span className="drink-bottle-label">{drink.shortLabel.split('\n').map((line) => <span key={line}>{line}</span>)}</span>
          <span className="drink-bottle-seal">RÉSERVE</span>
        </span>
      </div>
      <span className="drink-art-caption">SÉLECTION PREMIUM</span>
    </div>
  )
}

function App() {
  const [now, setNow] = useState(() => Date.now())
  const [baseTheme, setBaseTheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  )
  const [hasScrolled, setHasScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [flyerOpen, setFlyerOpen] = useState(false)
  const logoTapTimerRef = useRef(null)
  const lastLogoTapRef = useRef(0)
  const drinksTrackRef = useRef(null)
  const drinksSectionRef = useRef(null)
  const flyerTriggerRef = useRef(null)
  const flyerCloseButtonRef = useRef(null)
  const eventIsLive = isEventWindowActive(now)
  const darkAppearance = eventIsLive || baseTheme === 'dark'
  const eventIsPast = now >= eventEnd
  const countdown = getCountdown(eventStart, now)
  const drinkOfTheDay = getDrinkOfTheDay(now)
  const logoButtonTheme = eventIsLive
    ? 'theme-logo-button-event'
    : baseTheme === 'dark'
      ? 'theme-logo-button-dark'
      : 'theme-logo-button-light'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => () => window.clearTimeout(logoTapTimerRef.current), [])

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 24)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const revealItems = document.querySelectorAll('[data-reveal]')
    if (!revealItems.length) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    document.documentElement.classList.add('reveal-enabled')
    revealItems.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-enabled')
    }
  }, [])

  useEffect(() => {
    if (!flyerOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setFlyerOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    flyerCloseButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      flyerTriggerRef.current?.focus()
    }
  }, [flyerOpen])

  useEffect(() => {
    const section = drinksSectionRef.current
    const track = drinksTrackRef.current
    if (!section || !track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let sectionCentered = false
    let paused = false
    let interval
    let resumeTimer

    const stop = () => window.clearInterval(interval)
    const start = () => {
      stop()
      if (!sectionCentered || paused) return
      interval = window.setInterval(() => {
        const card = track.querySelector('.drink-card')
        if (!card) return
        const step = card.getBoundingClientRect().width + 14
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8
        track.scrollBy({ left: atEnd ? -track.scrollLeft : step, behavior: 'smooth' })
      }, 4200)
    }
    const observer = new IntersectionObserver(([entry]) => {
      sectionCentered = entry.isIntersecting
      if (sectionCentered) start()
      else stop()
    }, { rootMargin: '-34% 0px -34% 0px', threshold: 0 })
    const pause = () => {
      paused = true
      stop()
    }
    const resume = () => {
      paused = false
      start()
    }
    const resumeAfterTouch = () => {
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(resume, 6500)
    }

    observer.observe(section)
    track.addEventListener('pointerenter', pause)
    track.addEventListener('pointerleave', resume)
    track.addEventListener('focusin', pause)
    track.addEventListener('focusout', resume)
    track.addEventListener('touchstart', pause, { passive: true })
    track.addEventListener('touchend', resumeAfterTouch, { passive: true })

    return () => {
      observer.disconnect()
      stop()
      window.clearTimeout(resumeTimer)
      track.removeEventListener('pointerenter', pause)
      track.removeEventListener('pointerleave', resume)
      track.removeEventListener('focusin', pause)
      track.removeEventListener('focusout', resume)
      track.removeEventListener('touchstart', pause)
      track.removeEventListener('touchend', resumeAfterTouch)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('event-mode', eventIsLive)
    root.classList.toggle('theme-dark', !eventIsLive && baseTheme === 'dark')
    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.content = eventIsLive || baseTheme === 'dark' ? '#080808' : '#ffffff'
    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon) favicon.href = eventIsLive ? '/images/all-black-event-logo.png' : '/images/le-mont-royal-logo.png'
  }, [eventIsLive, baseTheme])

  const eventStatus = eventIsLive
    ? "L'événement est en cours"
    : eventIsPast
      ? 'Événement terminé'
      : 'Prochain rendez-vous'

  const handleLogoButtonClick = (event) => {
    if (event.detail === 0) {
      if (!eventIsLive) setBaseTheme((theme) => theme === 'dark' ? 'light' : 'dark')
      return
    }

    const now = Date.now()
    if (now - lastLogoTapRef.current < 320) {
      window.clearTimeout(logoTapTimerRef.current)
      logoTapTimerRef.current = null
      lastLogoTapRef.current = 0
      document.getElementById('accueil')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
      return
    }

    lastLogoTapRef.current = now
    logoTapTimerRef.current = window.setTimeout(() => {
      lastLogoTapRef.current = 0
      logoTapTimerRef.current = null
      if (!isEventWindowActive(Date.now())) {
        setBaseTheme((theme) => theme === 'dark' ? 'light' : 'dark')
      }
    }, 320)
  }

  return (
    <div className="min-h-screen pb-[82px] text-[var(--ink)] transition-colors duration-700 md:pb-0">
      <header className={`site-header page-intro sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--page)]/90 backdrop-blur-xl ${hasScrolled ? 'is-scrolled' : ''}`}>
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between gap-3 px-4 sm:h-[86px] sm:px-7 lg:px-12">
          <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="logo-lockup">
              <button
                className={`theme-logo-button ${logoButtonTheme}`}
                type="button"
                aria-label={eventIsLive ? 'Logo Le Mont Royal, thème événement actif' : 'Changer le thème, double-taper pour revenir à l’accueil'}
                aria-pressed={darkAppearance}
                aria-disabled={eventIsLive}
                title={eventIsLive ? 'Thème événement · double-taper pour l’accueil' : 'Appuyer pour changer le thème · double-taper pour l’accueil'}
                onClick={handleLogoButtonClick}
                onContextMenu={(event) => event.preventDefault()}
              >
                <img
                  className="logo-mark h-[36px] w-[48px] object-contain sm:h-[42px] sm:w-[56px]"
                  src={eventIsLive ? '/images/all-black-event-logo.png' : '/images/le-mont-royal-logo.png'}
                  alt=""
                  draggable="false"
                  width="612"
                  height="408"
                />
              </button>
              <span className="logo-welcome">BIENVENUE</span>
            </div>
            <span className="hidden min-w-0 flex-col sm:flex">
              <span className="font-display text-sm font-bold uppercase tracking-[0.08em] text-[var(--ink)] lg:text-base">Le Mont Royal</span>
              <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Bafoussam · Cameroun</span>
            </span>
          </div>

          <nav className="hidden items-center gap-3 md:flex lg:gap-6" aria-label="Navigation principale">
            {navigation.map((item) => (
              <a
                className="header-nav-link py-2 text-[11px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] lg:text-[13px]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="hidden min-h-11 items-center gap-2 border border-[var(--accent)] bg-[var(--accent)] px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-transparent hover:text-[var(--accent)] md:inline-flex"
            href={`tel:+237${featuredEvent.phones[0]}`}
          >
            <IconBadge icon={Phone} size={15} compact />
            Réserver
          </a>

          <button
            className="flex size-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--icon-surface)] text-[var(--icon-ink)] md:hidden"
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav
            className="absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--page)] px-5 pb-5 pt-2 shadow-lg md:hidden"
            aria-label="Navigation mobile"
          >
            {navigation.map((item) => (
              <a
                className="block border-t border-[var(--line)] py-3 text-sm font-semibold"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              className="mt-3 flex items-center justify-center gap-2 bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white"
              href={`tel:+237${featuredEvent.phones[0]}`}
            >
              <IconBadge icon={Phone} size={15} compact /> Réserver par téléphone
            </a>
          </nav>
        )}
      </header>

      <main>
        <section id="boissons" ref={drinksSectionRef} className="px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3" data-reveal>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Spiritueux premium · 18+</p>
                <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Spiritueux haut de gamme</h2>
              </div>
              <p className="max-w-xs text-xs leading-5 text-[var(--muted)]">Une sélection à découvrir, selon les arrivages.</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3" data-reveal>
                <p className="text-xs font-bold uppercase tracking-[0.14em]">Notre sélection premium</p>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[10px] text-[var(--muted)] sm:inline">Faites défiler horizontalement</span>
                  <button className="drink-control" type="button" aria-label="Boisson précédente" onClick={() => drinksTrackRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}>
                    <ChevronLeft size={17} />
                  </button>
                  <button className="drink-control" type="button" aria-label="Boisson suivante" onClick={() => drinksTrackRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}>
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="drink-carousel-frame">
                <div className="drink-scroll" ref={drinksTrackRef} role="list" aria-label="Sélection de spiritueux premium">
                  {drinks.map((drink, index) => (
                    <article className="drink-card" data-reveal style={{ '--reveal-delay': `${Math.min(index, 4) * 70}ms` }} key={drink.name} role="listitem">
                      <DrinkArtwork drink={drink} />
                      <div className="drink-card-copy">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{drink.category}</p>
                        <h3 className="mt-2 min-h-12 font-display text-lg leading-tight font-semibold">{drink.name}</h3>
                        <p className="mt-2 text-[11px] text-[var(--muted)]">{drink.origin} · {drink.service}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <article className="drink-feature-card mt-7 grid overflow-hidden rounded-2xl border border-[var(--accent)]/50 md:grid-cols-[0.8fr_1.2fr]" data-reveal>
                <DrinkArtwork drink={drinkOfTheDay} />
                <div className="flex flex-col justify-between p-5 sm:p-7">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">La suggestion du jour</p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">{drinkOfTheDay.category} · {drinkOfTheDay.origin}</p>
                    <h3 className="mt-2 font-display text-2xl leading-tight font-semibold sm:text-3xl">{drinkOfTheDay.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{drinkOfTheDay.service}</p>
                  </div>
                  <a className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 border border-[var(--accent)] px-4 text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white" href="#contact">
                    Demander cette boisson <ArrowRight size={16} />
                  </a>
                </div>
              </article>
              <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">Illustrations de bouteilles à titre indicatif. Disponibilité et prix à confirmer auprès de l'équipe. Réservé aux adultes · À consommer avec modération.</p>
            </div>
          </div>
        </section>

        <section id="accueil" className="scroll-mt-8">
          <div className="mx-auto max-w-[1440px] px-3 pt-4 sm:px-6 sm:pt-7 lg:px-10">
            <div className="hero-stage page-intro" data-reveal>
              <img
                className="hero-stage-image"
                src="/images/placeholder-venue.jpg"
                alt="Façade lumineuse du Mont Royal, visuel de présentation"
                fetchPriority="high"
              />
              <div className="hero-stage-shade" />
              <div className="hero-stage-copy rise-in">
                <p className="hero-eyebrow"><span /> Le Mont Royal vous salut</p>
                <h1>Le Mont<br />Royal<span>.</span></h1>
                <p className="hero-description">Votre adresse pour les soirées et événements à Bafoussam.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a className="inline-flex min-h-12 items-center gap-3 bg-[var(--accent)] px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" href={`tel:+237${featuredEvent.phones[0]}`}>
                    Réserver une table <ArrowRight size={17} />
                  </a>
                  <a className="inline-flex min-h-12 items-center gap-3 border border-white/55 bg-black/15 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black" href="#evenements">
                    Voir les événements <CalendarDays size={16} />
                  </a>
                </div>
              </div>
              <span className="hero-stage-caption">Visuel de présentation</span>
            </div>

            <div className="hero-details-grid">
              <div className="hero-detail-item" data-reveal>
                <span className="hero-detail-label">Prochain rendez-vous</span>
                <strong>{featuredEvent.title}</strong>
              </div>
              <div className="hero-detail-item" data-reveal>
                <span className="hero-detail-label">Date & ouverture</span>
                <strong className="capitalize">{formatEventDate()} · 20H</strong>
              </div>
              <div className="hero-detail-item" data-reveal>
                <span className="hero-detail-label">Nous trouver</span>
                <strong>Bafoussam Akwa</strong>
              </div>
              <a className="hero-detail-link" data-reveal href="#contact">Nous contacter <ArrowDownRight size={17} /></a>
            </div>
          </div>
        </section>

        <section id="evenements" className="scroll-mt-8 border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 lg:px-12 lg:py-20">
            <div className="event-poster-wrap" data-reveal>
              <button
                className="event-poster-trigger"
                type="button"
                ref={flyerTriggerRef}
                aria-label="Agrandir l'affiche All Black Party"
                aria-haspopup="dialog"
                onClick={() => setFlyerOpen(true)}
              >
                <img className="event-poster" src="/images/all-black-party-flyer.png" alt="" loading="lazy" />
                <span className="event-poster-caption">Agrandir l’affiche <Expand size={14} /></span>
              </button>
            </div>

            <div className="event-details-panel rounded-2xl border border-[var(--line)] bg-[var(--page)] p-5 sm:p-8 lg:p-10" data-reveal>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                  <span className={`size-2 rounded-full ${eventIsLive ? 'animate-pulse bg-[var(--accent)]' : 'bg-[var(--accent)]'}`} />
                  {eventStatus}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Édition spéciale
                </span>
              </div>
              <div className="py-6 sm:py-8">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">À l’affiche · Bafoussam</p>
                <h3 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-none font-semibold">
                  {featuredEvent.title}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">{featuredEvent.description}</p>
                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <IconBadge icon={CalendarDays} size={17} />
                    <div>
                      <p className="font-semibold capitalize">{formatEventDate()}</p>
                      <p className="mt-1 text-[var(--muted)]">Ouverture à 20H</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconBadge icon={MapPin} size={17} />
                    <p className="font-semibold leading-6">{featuredEvent.location}</p>
                  </div>
                </div>
              </div>
              {!eventIsPast && (
                <div className="border-t border-[var(--line)] pt-5">
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    <IconBadge icon={Clock3} size={13} compact />
                    {eventIsLive ? "L'événement est en cours" : 'Le compte à rebours est lancé'}
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Compte à rebours">
                    {countdown.map((unit) => (
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)]/65 px-2 py-3 text-center sm:px-4 sm:py-4" key={unit.label}>
                        <span className="block font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                          {String(unit.value).padStart(2, '0')}
                        </span>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[10px]">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--line)] pt-5 text-sm">
                {featuredEvent.phones.map((phone) => (
                  <a
                    className="font-semibold tabular-nums transition-colors hover:text-[var(--accent)]"
                    href={`tel:+237${phone}`}
                    key={phone}
                  >
                    +237 {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="galerie" className="scroll-mt-8">
          <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5" data-reveal>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                  L'univers du Mont Royal
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                  L'ambiance en images.
                </h2>
              </div>
              <a className="inline-flex items-center gap-2 text-sm font-bold hover:text-[var(--accent)]" href="#evenements">
                Tous les rendez-vous <ArrowRight size={16} />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { src: '/images/placeholder-crowd.jpg', label: 'Soirées', alt: 'Image temporaire de foule en soirée, issue de la maquette' },
                { src: '/images/placeholder-champagne.jpg', label: 'Moments à partager', alt: 'Image temporaire de verres de célébration, issue de la maquette' },
                { src: '/images/placeholder-lounge.jpg', label: 'Le lieu', alt: 'Image temporaire d’un espace lounge, issue de la maquette' },
                { src: '/images/placeholder-dj.jpg', label: 'Musique', alt: 'Image temporaire d’une table de mixage, issue de la maquette' },
                { src: '/images/placeholder-party.jpg', label: 'Ambiance', alt: 'Image temporaire de soirée, issue de la maquette' },
              ].map((image, index) => (
                <article className="group relative aspect-[1.12/1] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_12px_30px_rgb(26_18_8_/_8%)]" data-reveal style={{ '--reveal-delay': `${index * 65}ms` }} key={image.src}>
                  <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={image.src} alt={image.alt} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                  <span className="absolute left-3 top-3 border border-[var(--accent)]/70 bg-black/75 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                    Visuel temporaire
                  </span>
                  <p className="absolute bottom-3 left-3 text-sm font-bold text-white">{image.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="apropos" className="scroll-mt-8 border-y border-[var(--line)] bg-[var(--surface)]">
          <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-12 lg:py-24">
            <figure className="group relative aspect-[1.2/1] overflow-hidden rounded-2xl border border-[var(--accent)]/50 bg-black shadow-[0_18px_42px_rgb(26_18_8_/_14%)]" data-reveal>
              <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="/images/placeholder-venue.jpg" alt="Visuel temporaire de la façade du lieu, issu de la maquette" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 border border-[var(--accent)] bg-black/75 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Photo temporaire</span>
              <figcaption className="absolute bottom-4 left-4 font-display text-2xl font-semibold text-white">Le Mont Royal · Bafoussam</figcaption>
            </figure>
            <div data-reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">À propos · Le Mont Royal</p>
              <h2 className="mt-4 max-w-[720px] font-display text-3xl leading-[1.12] font-semibold sm:text-5xl">
                Plus qu'un lieu, une expérience.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-[var(--muted)]">
                Le Mont Royal vous accueille à Bafoussam Akwa pour vos soirées,
                vos événements et vos moments à partager.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[var(--line)] pt-6">
                <div className="flex items-center gap-3 text-sm font-semibold"><IconBadge icon={Crown} /> Ambiance de luxe</div>
                <div className="flex items-center gap-3 text-sm font-semibold"><IconBadge icon={Music2} /> Musique variée</div>
                <div className="flex items-center gap-3 text-sm font-semibold"><IconBadge icon={Users} /> Espace convivial</div>
                <div className="flex items-center gap-3 text-sm font-semibold"><IconBadge icon={ShieldCheck} /> Sécurité garantie</div>
              </div>
              <a className="mt-7 inline-flex min-h-11 items-center gap-3 border border-[var(--accent)] px-4 text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black" href="#contact">
                Nous contacter <ArrowDownRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-8">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-24">
            <div data-reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Contact & réservations
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight font-semibold sm:text-5xl">
                On vous garde<br />une place ?
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-[var(--muted)]">
                Appelez-nous ou écrivez-nous sur WhatsApp pour préparer votre
                venue.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2" data-reveal>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/70 p-5 shadow-sm sm:p-7">
                <IconBadge icon={Phone} />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Réservation</p>
                <div className="mt-3 space-y-2">
                  {featuredEvent.phones.map((phone) => (
                    <a
                      className="block text-lg font-semibold tabular-nums hover:text-[var(--accent)]"
                      href={`tel:+237${phone}`}
                      key={phone}
                    >
                      +237 {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6)}
                    </a>
                  ))}
                </div>
                <a
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--accent)] px-4 text-sm font-bold text-white"
                  href={`https://wa.me/237${featuredEvent.phones[0]}?text=Bonjour%20Le%20Mont%20Royal%2C%20je%20souhaite%20r%C3%A9server.`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp <ArrowRight size={16} />
                </a>
              </div>
              <div className="flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)]/70 p-5 shadow-sm sm:p-7">
                <IconBadge icon={MapPin} />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Nous trouver</p>
                <p className="mt-3 text-lg leading-7 font-semibold">{featuredEvent.location}</p>
                <a
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-bold hover:text-[var(--accent)]"
                  href="https://www.google.com/maps/search/?api=1&query=Bafoussam%20Akwa%20face%20Maison%20des%20Vestes"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ouvrir dans Maps <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {flyerOpen && (
        <div
          className="flyer-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="flyer-lightbox-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setFlyerOpen(false)
          }}
        >
          <h2 className="sr-only" id="flyer-lightbox-title">Affiche All Black Party</h2>
          <button
            className="flyer-lightbox-close"
            type="button"
            ref={flyerCloseButtonRef}
            aria-label="Fermer l’affiche agrandie"
            onClick={() => setFlyerOpen(false)}
          >
            <X size={22} />
          </button>
          <img className="flyer-lightbox-image" src="/images/all-black-party-flyer.png" alt="Affiche All Black Party, le 7 novembre 2026 à 20H à Bafoussam Akwa" />
        </div>
      )}

      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Nous trouver</p>
              <a className="mt-3 inline-flex items-center gap-3 text-sm font-semibold hover:text-[var(--accent)]" href="https://www.google.com/maps/search/?api=1&query=Bafoussam%20Akwa%20face%20Maison%20des%20Vestes" target="_blank" rel="noreferrer">
                <IconBadge icon={MapPin} size={17} />
                Bafoussam Akwa · Face Maison des Vestes
              </a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Réservations</p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                {featuredEvent.phones.map((phone) => (
                  <a className="inline-flex items-center gap-3 text-sm font-semibold tabular-nums hover:text-[var(--accent)]" href={`tel:+237${phone}`} key={phone}>
                    <IconBadge icon={Phone} size={16} />
                    +237 {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6)}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Le Mont Royal · Bafoussam, Cameroun</p>
            <a className="inline-flex items-center gap-2 font-semibold text-[var(--ink)] hover:text-[var(--accent)]" href="#accueil">
              Retour en haut <ArrowDownRight className="rotate-[-135deg]" size={15} />
            </a>
          </div>
        </div>
      </footer>
      <div className="mobile-booking-bar md:hidden">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Prochain rendez-vous</p>
          <p className="truncate text-sm font-bold">{featuredEvent.title}</p>
        </div>
        <a className="inline-flex min-h-11 shrink-0 items-center gap-2 bg-[var(--accent)] px-4 text-xs font-bold uppercase tracking-[0.08em] text-white" href={`tel:+237${featuredEvent.phones[0]}`}>
          <IconBadge icon={Phone} size={14} compact /> Réserver
        </a>
      </div>
    </div>
  )
}

export default App