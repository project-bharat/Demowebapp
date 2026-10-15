# GalleryPass — Appointment & Arrival Desk

A mobile-friendly React prototype for sales-gallery appointment booking, QR invitation tickets, and reception check-in. It uses React 18, Tailwind CSS CDN, QRCode.js, and html5-qrcode directly from CDN; no build step is required.

## Demo features

- Manager and reception role-selection sign-in screens (demo-only, not secure authentication).
- Manager Booker tab for guest details, date/time, host, venue, purpose, notes, and guest count.
- Unique booking/invite code and QR ticket.
- Print / Save as PDF and WhatsApp share text.
- Reception Arrival tab with camera QR scanner and lookup by name, invite code, or phone.
- Exact appointment detail dialogue and arrival/completion/cancellation actions.
- Browser-local persistence via localStorage and sample records.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the static root when pushed to `main`.

1. Open **Settings → Pages** in the repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Open **Actions**, select **Deploy GalleryPass to GitHub Pages**, and confirm the latest run succeeds.
4. The expected project URL is `https://project-bharat.github.io/Demowebapp/` once Pages is enabled and deployment succeeds.

Because the repository is currently private, GitHub Pages availability depends on the account/organization plan and repository Pages settings. If GitHub does not allow Pages for this private repository, change visibility only if appropriate for your organization, or use an approved hosting plan.

## Important production boundary

This is a front-end prototype, not an industry-ready production system yet. Data is stored in the current browser only, so manager and reception users on different devices do not share bookings. Demo role selection is not authentication; anyone who can load the static page can inspect the client-side code and data.

Before using real customer/patient/client data, connect a secured backend (for example, Google Apps Script Web App with server-side authorization and a Google Sheet/database), implement real role-based access and audit logs, validate booking availability server-side, and add privacy/retention controls. Do not put credentials or service secrets in this static repository.

## Google Apps Script integration

The top of `index.html` contains:

```js
const GAS_WEB_APP_URL = "";
```

This is an integration placeholder. The current prototype does not send requests to Google Apps Script. Once the deployed Apps Script API and its authorization contract are available, connect create/find/update operations there; do not treat localStorage as shared or authoritative data.

## QR format

The QR contains JSON with an `inviteCode` property, for example:

```json
{"inviteCode":"GP-261016-1234"}
```

The reception scanner also attempts to accept plain invite codes and objects with `code` or `bookingCode` properties.
