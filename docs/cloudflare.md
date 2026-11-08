# Cloudflare and the custom domain

Cloudflare controls registrar/DNS for `musaeminozdem.com`. ChatGPT Sites hosts
the application and its persisted D1 content. A Cloudflare account login alone
does not recover the Sites application source or hosted database.

## Historical domain configuration

These values were reported working in the original handoff. They are not
current settings verified by this session and are not instructions to reapply
them.

| Record or setting | Reported value |
| --- | --- |
| Apex A | `162.159.143.30` |
| Apex A | `172.66.3.26` |
| Proxy mode | DNS-only |
| Verification TXT names | `_openai-site-verification`, `_cf-custom-hostname` |
| Domain/SSL status | Verified active at the time of the handoff |
| Sites domain association | `appgdom_6aef8fc99a6c819184cabdf5d2f32ba6` |

TXT values were not provided here; do not invent them. The original account DNS
page reference is retained in [the handoff](../WEBSITE_HANDOFF.md#hosting-and-domain-reported-history).
No DNS export or current SSL inspection is included in this repository.

## Limits on future changes

Check actual DNS, Sites domain association, SSL state, and proxy compatibility
before proposing changes. Do not toggle proxying, recreate records, detach the
domain, move hosting, or deploy a Worker based on this historical table.
The reported recent Sites `get_site` check confirms the custom live URL in the
sender's session; it does not verify these DNS values. No DNS or hosting change
is part of the documentation task.
