# Design and content preservation

The chosen reference is <https://shreyashankar.com/>: a restrained academic
look, typography, sizing, structure, and writing tone. User feedback drove
several revisions. Use Musa's truthful content; do not copy the reference
author's biography, credentials, papers, or mentees.

## Reported visual specifications

| Element | Historical specification |
| --- | --- |
| Body | Inter, 15px/25.5px, `#333`, 16px paragraph gap |
| Headings | Lora, 24px/31.2px, weight 600 |
| Background | `#fdfcfa` |
| Desktop layout | Max width 1080px, sidebar 240px, gap 64px |
| Portrait | `/musa-portrait.webp`; 220px desktop, 160px/140px responsive |
| Breakpoints | 900/720/600 |
| Mobile | Centered portrait, hamburger menu |
| Header/footer | GitHub, Scholar, and X logos |

These are historical measured specifications; see `app/globals.css` and
`app/site.tsx` for the recovered implementation. The recovered `public/` tree
includes the supplied PNG portrait, its WebP derivative, and self-hosted fonts.

Known profile/project references are GitHub <https://github.com/tirtilaklak>,
LinkedIn <https://www.linkedin.com/in/musa-emin-ozdem/>, and
<https://sciencetostartup.com/>. Unset Scholar/X links intentionally remain
noninteractive with accessible profile-not-added labels, activating only when
configured in the editor. Do not invent missing social URLs.

## Live content is authoritative

Musa has been editing the live site and paused task 3. Historical biography
copy is not the current source of truth. Preserve current D1 biography, profile
links, posts, and drafts instead of reseeding from source defaults or this
documentation. `app/content.ts` contains default public copy and upgrade logic,
not a live-content snapshot or a seeding instruction. Do not copy private drafts,
database snapshots, or confidential
professional material into GitHub. The full original context remains in
[the handoff](../WEBSITE_HANDOFF.md); it is not a replacement for live content.
