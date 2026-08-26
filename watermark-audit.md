# Watermark audit

The CAEMS-owned frontend source contains no `Made with Manus` or `Made by Manus` user-facing text. The published page loads the CAEMS content and current copyright policy, but the visible badge appears in the browser capture while a DOM inspection reports `document.body.innerText.includes('Made with Manus') === false` and finds no matching element. This indicates the badge is injected by the hosting/preview interface rather than by CAEMS source code, so it cannot be removed through a JSX or JavaScript edit without changing platform branding settings.
