> HISTORICAL ONLY: recovered v10 notes include obsolete claims about an unconnected domain, ChatGPT admin authentication, a placeholder portrait, and access policy. Do not apply them as current settings. See [architecture](../architecture.md), [Firebase auth](../firebase-auth.md), and [design](../design-and-content.md).

# Musa's personal website

## Editing
The signed-in owner can click **Edit site**. Save changes stores content in D1 and updates the page immediately. Biography paragraphs use blank lines. Interests and background use one item per line. Profile and project links must be HTTPS; project links are optional. Portrait uploads accept PNG, JPEG and WebP up to 1 MB. The initials block is intentionally a placeholder, not a generated likeness.

The site's verified owner email is checked server-side for writes. The private Sites access boundary is preserved. Public access would require the owner to sign in with ChatGPT to edit; anonymous visitors cannot write. Do not remove server-side owner authorization when changing access.

## Publishing and domain
The site is initially owner-private. Do not change its audience without the user's request. The custom domain musaeminozdem.com is not connected or ownership-verified. Sites supports custom domains and returns provider-specific DNS validation records when added; no external Cloudflare account is required for the initial Sites-hosted preview.

## Content status
Initial biographical content is a reviewable draft based on supplied background. The portfolio contains no invented papers, client details, claimed research results, funding amounts or confidential documents. The user should add a portrait, verified profile links, contact address and specific public project artifacts before public release.

## Implementation
Vinext/React with D1 persistence. Fonts (Inter and Lora) are self-hosted. Editorial layout references shreyashankar.com, but no portrait, biography or academic claims were copied.

## Visual revision (reference fidelity)
Public-page geometry and typography now follow the reference's measured tokens: Inter15px/25.5px biography, Lora600 headings,1080px container,240px sidebar and64px column gap. Responsive breakpoints are900,720 and600px. The lead panel is informational, not a mailing-list signup. Login email is not published as contact. Public links are LinkedIn and ScienceToStartup; the résumé's GitHub link returned404 and was omitted.

The supplied portrait's original PNG is retained. The public page loads a24KB WebP derivative rather than the5.27MB original.

Authentication remains the original platform-backed guard until an independently managed email/password provider is approved and configured. Do not claim site-password login is ready.
