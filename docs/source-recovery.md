# Source recovery and provenance

Application source was recovered and imported into the existing `work` branch.
The new ZIP's bytes, hash, integrity, and paths were checked locally. No live
Site, Firebase setting, DNS record, or hosted D1 content was changed. The old
archive failure remains historical; it was not bypassed or retried.

## Evidence sources

| Source | What it establishes |
| --- | --- |
| [Original handoff](../WEBSITE_HANDOFF.md), thread `01a1b97a-b335-747c-9e09-71dad122001e` | Historical design, implementation, infrastructure, tests, and old archive provenance |
| Receiving Git/workspace checks | Original README/LICENSE tree; handoff committed/pushed as `b2561b5f9c9204bcbbcfd4556f7288411c2abbba` on `work`; new archive materialized and inspected here |
| Recovery updates, thread `01a1b981-2ce7-74bc-b9d8-c908423e2018` | Reported Sites checks, user-approved official repository credential, exact source fetch, and new ZIP export |

The sender reports that `get_site` confirmed the project active, latest version
10, live URL `https://musaeminozdem.com`, and current user owner. Earlier Library
searches found captured Site text but no archive; local Mac searches found no
source copy. These were sender results, not local tool calls. Captured text
alone was not used to reconstruct the app.

## Successful new source export

The user approved the official Sites source-repository write credential after
its scope was explained. The sender reports fetching the exact v10 commit and
exporting its tracked source. That credential was not sent to or stored in this
repository. This receiving session downloaded the new file only; it did not
create another credential or access the failed old archive.

| Field | Value and verification |
| --- | --- |
| Sites project | `appgprj_6aef8d3c88e481918e7e85e02b02db37` (sender provenance) |
| Version | `appgprj_6aef8d3c88e481918e7e85e02b02db37~appgver_2e3275f27ad88191a30cc3b6b992550b` (sender provenance) |
| Source commit | `264fc66b5584082a768274160a510f3901332a03` (sender's exact fetched commit) |
| Deployment | `appgdep_6aefab733d588191858d6d56b4c434e7` (sender provenance) |
| Filename | `musa-personal-source-v10.zip` |
| New Sediment file | `file_00000000a25881fdbed737a1e522b3a5` |
| Library ID | `libfile_fde3_f-e83f589bde488191adf6fc1ed72d8f2d_564d9e5050948191b73450228dd5ea87` |
| Bytes | **5,819,353**, verified locally |
| SHA256 | `6af0fff014febd126fee97aa3b14a556f20cee40ac5070006ad9d1fbbb2ea342`, verified locally |
| Files | **139**, locally counted; 7,638,253 uncompressed bytes |
| ZIP checks | CRC/integrity passed; no absolute/traversal/backslash paths, duplicates, symlinks, `.git`, `.env`, or `node_modules` entries |

The source commit is provenance supplied by the sender, not a Git object
imported into this repository: this is an archive-based import preserving the
existing repository history, not a merge of the Sites source history. Local
byte/hash verification establishes the received ZIP matches the reported export;
it does not independently attest the remote source repository or live deployment.

## Import review and deliberate differences

All 139 source files were retained, with these documented changes:

- Generic `README.md` moved to `docs/archive/STARTER-README.md` with a historical
  banner; the root README now describes this application and local workflow.
- `SITE-NOTES.md` moved to `docs/archive/SITE-NOTES.md` with an explicit obsolete
  status warning. Its disconnected-domain, ChatGPT-auth, placeholder-portrait,
  and audience statements must not be applied as current settings.
- One unnecessary personal legacy email in the old-identity rejection fixture
  in `tests/admin-auth.mjs` replaced with `legacy-user@example.test`. The test's
  purpose and production auth configuration are unchanged.

The existing LICENSE, history, retained handoff, and organized docs were
preserved. Starter components, examples, connector tooling, scripts, and lockfile
remain; unrelated cleanup is deferred. Recovered source includes application,
Firebase auth/config, Worker/hosting integration, schema/migration, tests,
portrait/fonts, and build/install scripts. There was no environment example in
the export; the inspected app uses public Firebase constants and a Worker `DB`
binding, with no required private `.env` credential identified. Do not invent
secret requirements or service-account files.

Local pattern scans and targeted source review found no private keys, GitHub/AWS
tokens, bearer credentials, service-account secret payloads, D1 snapshots, or
populated private blog drafts. Firebase web identifiers and owner UID/email are
intentional client/authorization identifiers, not secret credentials, and are
preserved. `app/content.ts` holds historical public defaults and upgrade logic,
not a current live-content export. Pattern scanning is not an exhaustive
security guarantee; no private live content was requested for this import.

## Nonproduction validation

Validation used Node 24.22.1 and npm 11.9.0, with the clean-clone portable
execution profile and locked `npm run install:ci`. Current results are below;
historical results remain in
[admin and blog](admin-and-blog.md#validation-status). Tests mock provider/DB
operations and do not certify real Firebase, hosted D1, or owner-browser flows.

| Current local check | Completed result |
| --- | --- |
| `npm run install:ci` | Passed, 775 packages installed; committed lockfile unchanged |
| `node tests/admin-auth.mjs` | Passed invalid-token rejection and signed-owner/mock-provider cases |
| `node tests/blog-backend.mjs` | Passed schema, privacy, required-version, conflict, body-limit, and source-filtering checks with mocked DB/auth |
| `node tests/rich-text.mjs` | Passed formatting, nested styles, line breaks, links, and XSS rejection |
| `tsc --noEmit` | Passed |
| `npm run lint` | Exit 0, no errors; 3 existing `app/site.tsx` warnings (one effect dependency, two image elements) |
| `npm run build` | Passed all five Vinext/Vite build phases; build notes `/admin/login` classification is unknown to static analysis |
| Local D1 migration and SQL read | Applied initial migration only to fresh local `.wrangler/state`; query confirmed the table exists with zero rows |
| Built local Worker smoke | `/`, `/admin`, and portrait returned 200 with expected content/asset; home had no D1 load-error notice; unauthenticated admin HTML omitted the default biography |
| Local anonymous content GET/PUT | Both returned 403 with private/no-store caching and Authorization included in Vary |
| Import fidelity | 136 source files byte-identical to ZIP; only the three deliberate document/fixture differences described above; LICENSE and original handoff preserved |

The HTTP smoke initially asserted that Vary was exactly `Authorization`; Vinext
also adds its routing headers. The probe was corrected to check membership,
then passed without any application change. Only the three existing regression
scripts were executed; no invented test-runner case count is claimed. Local
DB state, installed dependencies, and build output are ignored and not pushed.
The preview was stopped after verification. No real owner credentials, hosted
D1 content, production tests, or production migrations were used.

## Historical recovery failure

The old build TAR was reported as 95 files, 8,478,720 bytes, Sediment file
`file_00000000d9d081fd8127ca1a373b2b15`, SHA256
`a6e3432c37d9280a65f9d5d6efe783daf04c5beb8af2aecd0bff2c3cb9437258`.
Its single `download_file` attempt returned exactly
`file could not be authorized or resolved`; no local archive/path was returned.
Authorization versus resolution remained unresolved. It was not extracted,
verified, imported, or retried. The successful ZIP is a distinct newly supplied
file after the approved official recovery, with 139 tracked source files rather
than the old build TAR's 95 files.

The historical source path `/workspace/scratch/8c392136d846/musa-personal`
belonged to another assistant computer and was absent here. Earlier v9 source
commit `59c185c0cec3af78f6a5d34dcec667fcdfdf65e5` and version
`appgprj_6aef8d3c88e481918e7e85e02b02db37~appgver_430071a413e48191ab064358dacdf632`
remain historical references. Initial `main` and `site-source-admin-blog`
branches pointed to `7c86a49e1f9d7cb31b4e32047cbdbe2fee009ac1`; names alone
were never evidence of source transfer.

## Remaining limits

Implementation remains paused beyond source recovery and organization. A future
production change needs a new request, verification/backup of current user
content through authorized mechanisms, and review of non-destructive migrations.
Never reseed or reset hosted D1 from the historical source defaults. Real owner
create/save/publish and full mobile formatting/save workflows remain to be
certified; no production test posts or writes were made during recovery.
