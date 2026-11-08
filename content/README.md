# Prepared homepage revision

[`homepage-update.json`](homepage-update.json) contains public-facing copy
prepared from Musa's supplied priorities. It is a **partial content patch**, not
a complete site export. It has not been applied to the live site.

The revision leads with AI evaluation, reliable agents, and verifiable
environments, then supports that direction with engineering experience and
independent projects. AI Neolab is explicitly exploratory. There are no claims
of funding, demonstrated model improvements, research affiliations, or an
established lab. The private source document is not stored in this repository.

## Apply through the authorized editor

In a session with owner access, load the current editor content and download a
draft backup first. Replace only the fields present in this patch. Preserve
the current portrait, name, contact email, profile links, earlier-work sidebar,
announcement, blog introduction, and all posts (including drafts and archived
posts). Review the resulting page and save through the existing versioned
content API/editor. This file alone must not be submitted as a complete API
payload or used to reseed D1.

For an authorized API-based edit, obtain the complete current content and
version from private `GET /api/content`, retain a secure backup outside Git,
merge the listed fields into that current object, and use its version as
`If-Match` on PUT. Stop on a conflict, reread current content, and reconcile;
do not overwrite a newer version. Never place an owner token or private backup
in Git, logs, or chat. No auth or schema change is required.

## Verification limits

This receiving session could not reach `musaeminozdem.com`: the managed network
proxy rejected the HTTPS connection with `CONNECT tunnel failed, response 403`.
It also has no Sites editor tools or shared-browser controls for owner sign-in.
The failure occurred before reaching the application and is distinct from the
app's own authorization responses. No live read, backup, or write was made.

Local preview uses the recovered source's historical defaults merged with the
patch in **local D1 only**. It verifies rendering, not current live data or
production publication. The unchanged retained layout adds an exclamation mark
after the lead-panel heading; that punctuation is not stored in the copy.

The prepared revision passed desktop (1440px) and mobile (390px) browser checks:
new copy and headings rendered, no horizontal overflow or browser runtime
errors, and mobile navigation opened and closed with Escape. The portrait and
layout came from the recovered source. These are local draft screenshots:

- [Desktop preview](previews/homepage-desktop.png)
- [Mobile preview](previews/homepage-mobile.png)

No application code, auth configuration, live content, or blog records were
changed. Only the public patch, this record, screenshots, and README navigation
are included in the revision.
