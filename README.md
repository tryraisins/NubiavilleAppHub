# Nubiaville App Hub

Nubiaville App Hub is a public, installable workspace for Nubiaville applications. It has no sign-in, SharePoint connection, or administration interface. The application catalogue is intentionally maintained in source code.

## Local development

Use Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Managing applications in code

Edit [lib/applications.ts](./lib/applications.ts) to add, remove, or update an application. Each entry needs a name, description, icon key, and internal App Hub route.

```ts
{
  name: "Example application",
  description: "What people can do in it.",
  url: "/example",
  iconKey: "grid",
}
```

Routes must begin with `/` and remain on the App Hub origin. This keeps application navigation in the same installed PWA window.

## Installed App Hub (PWA)

App Hub has a root-scoped manifest and service worker. Supported browsers offer an **Install** control once the app is eligible. The installed app opens in standalone mode and navigation to an App Hub route remains in that same window.

The service worker caches only the static app shell and an offline message. A network connection is required to access connected applications.

## Connected applications and Vercel rewrites

Each connected application remains independently deployed but is reached through a same-origin App Hub path. For example, Leave must operate beneath `/leave` and TGIF beneath `/tgif`.

`vercel.json` contains explicit base and wildcard rewrite placeholders. Replace the destination hostnames only after the corresponding application is confirmed base-path-safe: its internal links, assets, API calls, authentication callbacks, and redirects must all work under its App Hub route. Do not add a broad catch-all rewrite because it would capture App Hub pages.

## Vercel deployment

Import this repository as its own Vercel project and deploy. No environment variables are required for App Hub itself.
