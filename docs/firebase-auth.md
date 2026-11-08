# Independent admin authentication

Musa explicitly rejected ChatGPT sign-in. The reported implementation uses
Firebase email/password authentication in project `musaeminozdem-admin` on
Spark (plan reported historically). Only the designated verified owner account
may edit. The recovered implementation is now inspectable; current Firebase
console settings and live authentication have not been audited here.

## Source-inspected implementation

- Login, sign-out, password reset/change, and email-verification UI.
- Server authorization pins the owner's Firebase UID and email and requires
  verified email.
- Signed ID tokens are checked for issuer, audience, signature, and expiry.
- Disabled, deleted, and revoked identities are rejected.
- The former ChatGPT-owner guard was removed.

`lib/firebase-auth.ts` uses `jose` to validate RS256 tokens with Google's X509
signing certificates, the Firebase project issuer/audience, owner UID/email,
verified email, timestamp claims, and a 20,000-character token limit. It calls
Firebase account lookup and rejects absent/deleted/disabled accounts and sessions
older than `validSince`. Provider or verification failures deny access.

`lib/firebase-config.ts` contains public web config and the owner email/UID
allowlist. These identifiers are not passwords, private keys, or service-account
credentials; they are preserved from the source. `app/admin/panel.tsx` implements
Firebase login/session persistence and password changes with reauthentication.
`app/admin/page.tsx` renders the client panel without loading private content.
Do not replace server authorization with an email-only or client-only guard.

## Evidence and remaining checks

Historical local crypto/mock-key tests reportedly accepted a valid verified
owner token and rejected anonymous, old ChatGPT, malformed, unsigned, oversized,
revoked, disabled, wrong-email, and unverified identities. Anonymous live writes
and private-content reads reportedly returned 403. User-provided evidence showed
successful owner sign-in with verified email and subsequent live edits.

The recovered mock-provider test can be run with `node tests/admin-auth.mjs`;
current local results are recorded in [source recovery](source-recovery.md).
Neither those tests nor historical reports certify the current deployment, and
the actual owner-browser blog publish round trip remains unverified. See
[admin and blog validation](admin-and-blog.md#validation-status).

Preserve independent Firebase authentication and server authorization. This
documentation task makes no Firebase changes. Keep passwords, tokens, OAuth
codes, service credentials, private drafts, and database snapshots out of Git.
Any future environment example must contain names/placeholders only, reviewed
against the recovered implementation.
