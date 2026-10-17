# GalleryPass GAS camera scanner

This change keeps the application on Google Apps Script + Google Sheets. The camera page is hosted separately over HTTPS because camera permissions may be unavailable inside the Apps Script HTML-service iframe.

## Deploy

1. Merge this change to `main`.
2. In the GitHub repository, open **Settings → Pages**. Set **Deploy from a branch**, branch **main**, folder **/(root)**, and save. Wait until GitHub Pages publishes the site.
3. Confirm this page opens on HTTPS: `https://project-bharat.github.io/Demowebapp/gas/scanner.html`. If GitHub Pages uses a different URL, update `SCANNER_PAGE_URL` in `gas/index.html` and redeploy.
4. In the linked Google Apps Script project, replace its `index.html` and `code.gs` contents with the matching files in `gas/`. Save.
5. Deploy → **Manage deployments** → edit the existing Web app deployment, choose **New version**, then Deploy. Keep the same deployment URL ending in `/exec`.
6. Open that `/exec` URL directly in Chrome on the phone, sign in if required, open Appointments → Scan QR → Enable camera. Allow camera permission on the GitHub Pages scanner tab.
7. Scan a GalleryPass invite QR. The scanner sends a scan event to the Apps Script `doPost` endpoint and posts the scanned value back to the original tab; the app should open the matching guest card. The Google spreadsheet will have a `Scans` tab.

## Important limitations

- This is a demo implementation. The web app endpoint is public if deployed with “Anyone”; anyone who discovers it can submit scan rows. Do not use real personal or client data without proper access controls and server-side validation.
- The scanner uses `fetch(..., mode: 'no-cors')`; browsers hide the HTTP response, so the scanner cannot prove that a scan row was written. Verify in the `Scans` sheet.
- The opener return uses `postMessage` from the configured GitHub Pages origin. If the browser or security settings remove the opener, use the displayed scan value and search manually.
- Camera access requires HTTPS, a compatible browser, and user permission. This does not guarantee every embedded browser/webview will work.
- The existing login screen is demo-only and does not authenticate users.
