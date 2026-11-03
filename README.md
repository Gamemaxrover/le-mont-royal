# Le Mont Royal

French-language venue and events website built with React, Vite, and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Edit the color themes

In `src/index.css`, change the `--theme-base-*` tokens for the white-and-orange page theme or the `--theme-event-*` tokens for the black-and-gold event theme. The event theme activates only during the configured event window.

## Update the featured event

Edit `src/data/events.js`. Set `dateTime` to the confirmed event time with the Cameroon offset (`+01:00`), then update the title, location, reservation numbers, and event-mode duration as needed. The dark event theme starts at the configured date and ends after `eventModeDurationHours`.

## Update the drinks menu

Edit `src/data/drinks.js` to add or remove drinks and adjust their category, origin, or serving suggestion. The featured drink rotates daily using the Africa/Douala date. Confirm the venue's current stock and prices before publishing the menu.

## Confirm before publishing

- The PDF lists November 7, 2026 at 20:00 WAT as an example date; confirm it is still current.
- Confirm the event-theme duration and the exact venue/map pin with the client.
- The venue and gallery images are temporary crops from the supplied design mockup. Replace them with client-approved venue and party photos before launch.