# Nubiaville App Hub

The App Hub is the standalone launcher for Nubiaville workplace tools. It owns the root experience for `portal.nubiaville.com`; each application behind it remains an independently deployed Vercel project.

## Local development

Use Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production checks are available with:

```bash
npm run lint
npm run build
npm run start
```

## Deploy to Vercel

1. Create a new Vercel project from this repository (do not import it into the Leave or TGIF projects).
2. In `vercel.json`, replace `YOUR_LEAVE_PROJECT.vercel.app` with the Leave project's production Vercel hostname, and replace `YOUR_TGIF_PROJECT.vercel.app` with the TGIF project's production Vercel hostname. Keep the `/leave` and `/tgif` path segments in every destination.
3. Deploy the App Hub project.
4. In the App Hub Vercel project's **Settings → Domains**, add `portal.nubiaville.com` and complete the DNS records Vercel provides.

The custom-domain assignment and external rewrite behavior must be checked against the real deployments after this configuration is complete.

## Why the applications stay separate

Leave Management and the TGIF Ordering Portal have their own repositories, release cycles, environments, and Vercel deployments. This repository is deliberately only the central launcher and reverse-proxy entry point. It does not use Vercel Microfrontends and does not merge either application into a monorepo.

## External Vercel rewrites

`vercel.json` proxies requests from the App Hub to the independent deployments while the browser keeps the `portal.nubiaville.com` address. Both the base and wildcard rules are required, so `/leave` and `/leave/dashboard` remain visible as portal URLs. The destinations intentionally preserve the subpath:

- `/leave` → `https://YOUR_LEAVE_PROJECT.vercel.app/leave`
- `/leave/:path*` → `https://YOUR_LEAVE_PROJECT.vercel.app/leave/:path*`
- `/tgif` → `https://YOUR_TGIF_PROJECT.vercel.app/tgif`
- `/tgif/:path*` → `https://YOUR_TGIF_PROJECT.vercel.app/tgif/:path*`

Do not add a broad catch-all rewrite: it could take over the App Hub's own root pages.

## Adding a future application

1. Deploy the future application independently and make it safe to run at a dedicated base path, such as `/work-permit`.
2. Add the typed card configuration in `lib/applications.ts` with its path, description, icon, and availability status.
3. Add only that app's explicit base and wildcard external rewrites in `vercel.json`, preserving its base path in the rewrite destinations.
4. Update this README and deploy the App Hub.

## TGIF prerequisite

The TGIF project must first be independently updated and redeployed with `basePath: "/tgif"`. Its API calls, authentication callbacks, public assets, metadata, PWA manifest, and service worker also need to be `/tgif`-safe. The App Hub cannot provide that compatibility layer; do not enable the `/tgif` rewrite in production until TGIF is ready.
