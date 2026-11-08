# Admin editor and blog manager

Behavior below is supported by recovered v10 source inspection and historical
reports, with tests distinguished below. This is not fresh production
certification. The editor is at <https://musaeminozdem.com/admin> and
uses [independent Firebase authentication](firebase-auth.md).

## Rich formatting: v9

The editor reportedly supports bold, italic, highlight, underline,
strikethrough, HTTPS links, and preview. Combined bold/italic and multiline
selection issues were fixed; line breaks are preserved. Rich text is rendered
with safe React elements rather than raw HTML, with unsafe-link/XSS checks.
Live biography preservation was checked historically.

## Structured blog management: v10

Reported workflow: refresh `/admin`, sign in, select **Blog → Manage blog posts
→ + New blog post**. Edit title, date, slug, excerpt, and body; use formatting
and preview; choose Draft/Published; save changes. Archiving is reversible.

Reported protections:

- Owner-only private loading and server filtering of drafts from public output.
- No private biography/content embedded in unauthenticated admin HTML.
- Atomic conflict/stale-tab detection and unsaved-close warnings.
- Public-post links, focus behavior, and downloadable draft backup.
- Preservation of existing writing when the single writing field was replaced.

## Inspected content API

`app/api/content/route.ts` requires owner authorization for both GET and PUT.
Responses use `Cache-Control: private, no-store` and `Vary: Authorization`.
PUT checks a supplied Origin, requires `If-Match` (428 if absent), validates
Zod content/post schemas, and bounds streamed bodies at 1,800,000 bytes.
Post IDs/slugs must be unique; slugs/dates are validated, and published posts
need a title/body. An atomic insert-if-absent or update matching `updated_at`
returns 409 on conflict instead of overwriting newer content.

`app/page.tsx` filters out drafts/archived posts on the server. `app/blog.tsx`
implements the blog manager, and `app/site.tsx` handles versioned saves,
unsaved warnings, and downloadable draft backup. `app/rich-text.tsx` renders
formatting through safe React elements. Source inspection does not prove that
the current hosted version or live owner workflows behave identically.

## Validation status

| Check | Historical result and limit |
| --- | --- |
| TypeScript, lint, build | Historically passed; recovered-source check results in [source recovery](source-recovery.md) |
| Authentication checks | Reported passed for the cases in [Firebase auth](firebase-auth.md) |
| Anonymous live writes/private reads | Reported 403 |
| Private drafts and unauthenticated admin HTML | Reported confidentiality checks passed |
| Rich text/XSS, schema, concurrent saves | Reported source/API checks passed |
| Desktop/mobile UI | Reported reviews covered overflow, menu, keyboard navigation, focus trap, Escape/return focus, and Home scrolling |
| Public Blog | Initially reported no published posts; current content is unknown |
| Real owner create → save → publish | Not independently certified; test-browser preview connection failed |
| Complete mobile formatting/save | Not independently certified for the same reason |

No production test posts were created in those reported checks. Owner sign-in
and live-edit evidence does not replace the missing end-to-end tests. Once
implementation resumes, verify real owner workflows, unauthorized access, draft
confidentiality, stale-tab protection, and responsive behavior using authorized
mechanisms. Preserve all current user content; do not seed test posts or reset
live data under this documentation request.

Existing local scripts are `tests/admin-auth.mjs`, `tests/blog-backend.mjs`, and
`tests/rich-text.mjs`. They test mocked identity/database behavior and source
assertions, not real Firebase, hosted D1, or an owner-browser publish workflow.
