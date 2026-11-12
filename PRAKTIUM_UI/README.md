# PRAKTIUM_UI

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Event API Configuration

Copy `.env.example` to `.env` and set `VITE_API_URL` to the base URL of your MockAPI project
(for example, the project URL ending in `/api/v1`; do not include a made-up URL). The application
uses the `events` resource and supports listing events, loading an event by ID, creating events,
and deleting events. Restart Vite after changing `.env`.

The API event fields are `id`, `title`, `cat`, `date`, `loc`, `quota`, `desc`, and `done`. The UI
maps these to its existing category, location, description, and available-seat fields. Until a URL
is configured, API-backed screens show an actionable configuration error rather than pretending a
server request succeeded.

The organizer dashboard at `/dashboard/events` creates and deletes events through the API. Event
data remains available in the shared `useEvents` state and browser LocalStorage cache under the
`gatherly-events` key. The API methods requested for this module do not include PUT/PATCH, so the
“Mark Complete” state remains a local override. Locally saved registrations are also subtracted
from the server quota in this browser; synchronizing registrations or quota changes across devices
requires a server-side update endpoint.

### Event Registration and Tickets

Visitors can register from an event detail page, review saved tickets at `/your-events`, and open
an individual ticket receipt at `/your-events/:ticketId`. Registrations, event seat counts, and
event data share the same `useEvents` state and LocalStorage record. Registrations are stored
locally in the current browser and are not synchronized to a server or other devices.

## Publish to GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open the repository and go to Settings > Pages.
3. Select `GitHub Actions` as the build and deployment source.
4. Push the project to the `main` branch. The workflow will build and publish it automatically.

The app will be published at:

```text
https://<username>.github.io/Praktikum_Pengembangan-UI1/
```

If your repository name is different, update the `base` value in `vite.config.js` and the repository path in `public/404.html` before deploying.
