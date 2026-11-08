# personal-website

Source and project context for [musaeminozdem.com](https://musaeminozdem.com),
recovered from the exact v10 source archive identified in
[source recovery](docs/source-recovery.md). The application uses React/Vinext,
ChatGPT Sites hosting with D1 persistence, and independent Firebase admin auth.
Pushing this repository does not deploy the website or transfer live D1 content.

| Document | Contents |
| --- | --- |
| [Architecture](docs/architecture.md) | Hosting, storage, auth, and verification status |
| [Cloudflare](docs/cloudflare.md) | Registrar/DNS responsibilities and historical domain settings |
| [Firebase auth](docs/firebase-auth.md) | Independent admin login and reported authorization checks |
| [Admin and blog](docs/admin-and-blog.md) | Editor workflow, protections, and outstanding tests |
| [Design and content](docs/design-and-content.md) | Styling reference and preservation of live edits |
| [Source recovery](docs/source-recovery.md) | Verified ZIP, import changes, provenance, and limits |
| [Original handoff](WEBSITE_HANDOFF.md) | Retained context and historical evidence in full |

## Local development

Use Node.js `>=22.13.0`, npm, and OpenSSL (for the auth test). From this checkout:

```sh
npm run install:ci
node tests/admin-auth.mjs
node tests/blog-backend.mjs
node tests/rich-text.mjs
./node_modules/.bin/tsc --noEmit
npm run lint
npm run build
```

`install:ci` uses `npm ci` with the committed lockfile. A clean clone defaults
to the portable execution profile; do not assume an external Sites plugin or
runtime credential exists. Run the tests before lint/build because they create
and clean up temporary modules. For development, `npm run dev` starts Vinext on
loopback port 5173. The built local Worker starts with `npm start -- --port 4173`.

For a fresh local database, build first, then apply the checked-in migration
**only locally**, before starting the built Worker:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_lovely_trauma.sql
```

Apply only migrations not already present; this initial migration is not
idempotent. `.wrangler/state` is local and ignored. See
[architecture](docs/architecture.md) for the schema. A home-page 200 alone does
not prove D1 works because the app catches load failures and renders defaults.
Firebase identifiers are in `lib/firebase-config.ts`; no private service-account
credential or required `.env` file is included. Local admin sign-in uses real
Firebase, whereas automated tests mock identity and persistence. Existing
starter ChatGPT/mock-auth helpers do not authorize this site's admin.

## Repository layout

`app/` contains the site, editor, blog, and content API; `lib/firebase-auth.ts`
implements server auth. `worker/` and `.openai/hosting.json` define Sites runtime
integration; `db/` and `drizzle/` contain schema/migrations. `public/` includes
the supplied portrait and local fonts. `tests/` contains the three regression
scripts. Starter components, examples, and build tooling are retained to avoid
unrelated changes. Original generic/stale notes are explicitly historical under
[`docs/archive/`](docs/archive/STARTER-README.md).

Musa paused implementation while editing the live site. The current request
authorizes source recovery, organization, nonproduction checks, and commit/push
to `work`. Preserve live edits; do not deploy, reseed hosted D1, change DNS,
change Firebase settings, or publish the environment under this request.
