# Nubiaville App Hub

Nubiaville App Hub is the secure, installable workspace for Nubiaville workplace tools. It uses Microsoft Entra ID for sign-in and stores the hub catalogue and administrator access list in SharePoint. Connected applications remain independently deployed, but are reached through App Hub paths so they stay inside the installed workspace.

## Local development

Use Node.js 20.9 or later.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Before running the application, fill in the Microsoft Entra ID and SharePoint values in `.env.local`.

```bash
npm run lint
npm run build
```

## Microsoft Entra ID setup

Create a dedicated **App registration** for App Hub, or add these redirect URIs to the existing registration used by the Leave application. Keep the client secret private and place it only in `.env.local` and Vercel environment variables.

1. In Microsoft Entra ID, register a single-tenant web application for Nubiaville.
2. Add a Web redirect URI for local development:
   `http://localhost:3000/api/auth/callback/microsoft-entra-id`
3. Add a production redirect URI:
   `https://nubiaville-app-hub.vercel.app/api/auth/callback/microsoft-entra-id`
   If you later assign `portal.nubiaville.com`, add `https://portal.nubiaville.com/api/auth/callback/microsoft-entra-id` too.
4. Under **API permissions**, add delegated SharePoint permissions for your tenant SharePoint resource: `AllSites.Read` and `AllSites.Write`. Grant tenant admin consent.
5. Copy the Application (client) ID, Directory (tenant) ID, and create a client secret. Add them to the environment variables shown in `.env.example`.

The app requests the signed-in user’s delegated SharePoint permissions. This mirrors the Leave application’s approach: SharePoint records retain the real Microsoft user in the built-in **Created By** and **Modified By** fields.

## SharePoint lists

Create both lists in the SharePoint site specified by `SHAREPOINT_BASE_URL`, then add their names to the Vercel environment variables. The internal column names below must be used exactly as written.

### `AppHubApplications`

Use a blank SharePoint list. Keep the default **Title** field and rename its display name to **Application name** if preferred.

| Internal name | Display name | Type | Required / default |
| --- | --- | --- | --- |
| `Title` | Application name | Single line of text | Required |
| `Description` | Description | Multiple lines of plain text | Required |
| `ApplicationUrl` | Launch URL | Single line of text | Required |
| `IconKey` | Icon | Choice: `calendar`, `clipboard`, `grid`, `shopping`, `tools` | Default `grid` |
| `Status` | Status | Choice: `Available`, `Coming soon` | Default `Available` |
| `IsActive` | Show on App Hub | Yes/No | Default Yes |
| `SortOrder` | Display order | Number, zero decimal places | Default `100` |

`Available` records appear inside App Hub. Their launch URL must be a same-site path such as `/leave` or `/tgif`; external URLs are deliberately rejected so users stay in the installed workspace. `Coming soon` records appear only when at least one exists. Inactive records remain in SharePoint but are hidden.

### `AppHubAdmins`

Use a second blank SharePoint list. Keep the default **Title** field and rename its display name to **Administrator email** if preferred.

| Internal name | Display name | Type | Required / default |
| --- | --- | --- | --- |
| `Title` | Administrator email | Single line of text | Required |
| `DisplayName` | Display name | Single line of text | Optional |
| `IsActive` | Active | Yes/No | Default Yes |
| `Notes` | Notes | Multiple lines of plain text | Optional |

Before setting `SHAREPOINT_ADMINS_LIST`, create active records with these values in **Title**:

- `samuelo@nubiaville.onmicrosoft.com`
- `ibikunle_johnson@nubiaville.onmicrosoft.com`
- `oluwaseun_sowemimo@nubiaville.onmicrosoft.com`
- `hr_executive@nubiaville.onmicrosoft.com`

Until this list is connected (or while it is empty for first-time setup), those four Microsoft Entra accounts are the bootstrap administrators. Once the list has records, its active entries determine administrator access. The **Manage** page lets an active administrator add, edit, deactivate, and remove both applications and administrators.

## Installed App Hub (PWA)

App Hub has a root-scoped web app manifest and service worker. On a supported browser, the **Install** control appears in the App Hub header after the browser determines the app is installable. The installed app opens in standalone mode and navigation to an App Hub path remains in that same window.

The service worker caches only the safe static app shell and an offline message. It does not cache signed-in application pages or SharePoint data, so a network connection is still required for Microsoft sign-in, current permissions, and workplace records.

For a connected application to stay in the PWA, all of its links, assets, API calls, authentication callbacks, and redirects must be base-path-safe beneath its App Hub route. For example, the Leave application must work at `/leave`, and TGIF must work at `/tgif`. Their Vercel deployments are rewritten behind App Hub under the same origin; do not use external application URLs in the SharePoint catalogue.

## Vercel deployment

1. Import this repository as a separate Vercel project.
2. Add every variable from `.env.example` under **Settings → Environment Variables**. Generate `AUTH_SECRET` with a secure random value, for example `openssl rand -base64 32`.
3. Deploy and complete a Microsoft Entra sign-in test with an ordinary user and one of the named administrators.
4. If using the central portal domain, add `portal.nubiaville.com` under **Settings → Domains**, complete Vercel’s DNS instructions, and add the matching Entra callback URI above.

`vercel.json` contains the independent-application rewrite placeholders. Replace them only after the Leave and TGIF deployments are confirmed safe to run beneath `/leave` and `/tgif`. The base and wildcard rewrites are required for PWA-contained navigation. Do not add a catch-all rewrite because it would capture the App Hub’s own routes.

## Important security notes

- Never commit `.env.local`, client secrets, access tokens, or SharePoint URLs that are not intended to be public.
- The admin page and all admin APIs verify the signed-in Microsoft Entra account on the server; hiding the Manage link alone is not treated as authorization.
- SharePoint permissions should be granted only to the app registration and users who need access to the two lists.
