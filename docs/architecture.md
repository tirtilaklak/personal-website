# Architecture and evidence

The architecture separates three services. Local source inspection now
supports the runtime design; live service settings remain separately qualified:

| Service | Responsibility | Evidence and limits |
| --- | --- | --- |
| Cloudflare account | Domain registration and DNS for `musaeminozdem.com` | Historical handoff; current DNS and account configuration have not been inspected here |
| ChatGPT Sites | Application hosting, deployment, custom-domain association, and persisted content in hosted D1 | Historical handoff plus a recent `get_site` result reported by the sending thread |
| Firebase Authentication | Independent email/password admin authentication | Recovered client/server implementation inspected; current Firebase console settings not audited |

The application is not a separately deployed Worker in Musa's Cloudflare
account. D1 is hosted with Sites; do not assume the registrar account provides
direct deployment or database access.

## Site identifiers

| Item | Value |
| --- | --- |
| Public URL | <https://musaeminozdem.com> |
| Admin URL | <https://musaeminozdem.com/admin> |
| Original Sites URL | <https://musa-emin-ozdem-personal.turfyarmadillo1.chatgpt.site> |
| Sites project | `appgprj_6aef8d3c88e481918e7e85e02b02db37` |
| Custom-domain association (historical) | `appgdom_6aef8fc99a6c819184cabdf5d2f32ba6` |
| Firebase project (historical) | `musaeminozdem-admin` |

## Current checks versus historical reports

The latest sending thread reports that Sites `get_site` returned the project
as active, latest version 10, `current_live_url` equal to the public URL above,
and the current user as owner. It returned no source-repository credential.
This is a reported tool result from that thread, not a fresh check performed
in this repository session. It does not independently establish the deployed
code's behavior, DNS values, Firebase settings, or the contents of live D1.

## Recovered implementation

Locally verified: the [v10 ZIP](source-recovery.md) was materialized and checked
for size, SHA256, safe paths, and integrity before import. React 19/Vinext with
Vite provides the application; `worker/index.ts` delegates to Vinext's fetch
handler. `.openai/hosting.json` identifies the Sites project, binds D1 as `DB`,
and declares no R2 bucket (`r2: null`). The placeholder database ID in
`vite.config.ts` is for local simulation, not a production database identifier.

`db/schema.ts` defines `site_content` with text columns `id` (primary key),
`body` (JSON content), and `updated_at`. The single checked-in migration
`drizzle/0000_lovely_trauma.sql` creates the table without rows. The content API
reads/writes the `home` row through Drizzle using Worker `env.DB`; this repository
contains no live database export. `app/page.tsx` reads saved content and filters
posts to `published` before rendering. On database load failure it falls back to
historical defaults with a load-error indicator.

Private `GET`/`PUT /api/content` require Firebase owner authorization. Saves use
an `If-Match` version and conditional insert/update to prevent stale overwrites.
See [admin and blog](admin-and-blog.md) for limits and tests. The generic
ChatGPT-auth helpers remain as starter tooling; they are not the editor guard.

Live content is authoritative. Before a future authorized deployment, verify
and snapshot current content through authorized application mechanisms and
review migrations for non-destructive behavior. Never reset or reseed D1 from
source defaults. Implementation remains paused.
