# CAEMS full-stack demo upgrade

- [x] Upgrade the static project to full-stack web-db-user support.
- [x] Add a pilot interest data model and public backend procedure for submissions.
- [x] Connect the pilot form to the backend mutation with loading, success, and error states.
- [x] Add a live simulated incident map with timed marker updates and clear status controls.
- [x] Add language switching for the main demo UI with English, Hindi, and Marathi labels.
- [x] Add an SMS fallback simulation with send/retry status behavior for offline alert delivery.
- [x] Verify the upgraded flows, run checks/tests/build, and save a checkpoint.

- [x] Expand language switching to readiness labels, checklist rows, SOS control, and key authority/demo labels.
- [x] Add SMS fallback failed/retrying states with a user-triggered retry action.
- [x] Manually verify the pilot form, live map simulator, language switcher, and SMS fallback, then save the full-stack checkpoint.

- [x] Add a distinct visible SMS retrying state and save a checkpoint after final verification.

- [x] Store the provided chatbot API key as a server-side project secret without exposing it to the browser.
- [x] Add a validated server-side chatbot procedure with CAEMS emergency-response system instructions.
- [x] Add Vitest coverage for chatbot input validation and response shaping.
- [x] Add a responsive CAEMS AI assistant panel with suggested prompts, loading state, errors, and chat history.
- [x] Verify the chatbot integration and save an updated checkpoint.

- [x] Add a mocked Gemini response test covering chatbot text extraction and empty-provider errors.
- [x] Manually verify the chatbot drawer and save a final checkpoint after the chatbot update.

- [x] Replace the Build Notes content with a copyright and website content-use policy page section.
- [x] Include ownership, permitted/prohibited use, UGC, DMCA/takedown, counter-notification, open-source licensing, attribution, and contact details.
- [x] Update section labels and metadata so the policy page is discoverable and consistent with CAEMS SIH 2026 / NDD.
- [x] Verify the policy section responsively and save a checkpoint.

- [x] Add explicit designated copyright agent and DMCA-style notice submission method and requirements.
- [x] Update page title and description metadata to identify the new copyright and content-use policy.
- [x] Save a new checkpoint after the final policy verification.

- [x] Save the final checkpoint after the copyright-policy update and responsive verification.

- [x] Search site-facing source and metadata for Made with Manus watermark text or branding.
- [x] Remove any user-facing watermark while preserving required runtime/application code. (No source watermark found; the visible badge is platform-injected.)
- [x] Verify the clean preview, run checks/build, and save a checkpoint.

- [x] Reproduce the Gemini failure and capture the actual server/API error.
- [x] Fix the Gemini server request, model selection, or response parsing as needed.
- [x] Improve the client error state so failures are visible and actionable.
- [x] Verify a real chatbot prompt/response flow and save a repair checkpoint.

- [x] Rebuild the primary nav as a floating, rounded glassmorphism element with existing elevation language.
- [x] Add rAF-gated scroll-direction and idle detection with top-of-page visibility.
- [x] Keep the nav visible while keyboard focus is inside it and always visible under reduced-motion preferences.
- [x] Preserve or map the requested nav contents and working anchors/CTA behavior.
- [x] Verify desktop/mobile screenshots and checks before changing any other fixed elements.

- [x] Update the floating navbar labels to Features, Identity, Security, Blog, and Request Demo as requested.
- [x] Map each requested nav label to a real CAEMS section target and keep the logo as a home anchor.
- [x] Re-verify the updated labels and targets before the final navigation checkpoint.

- [x] Compare the current floating nav against the supplied glassmorphism reference.
- [x] Add richer layered glass depth, softer highlights, and smoother nav transition without changing other fixed elements.
- [x] Verify desktop/mobile visual quality and reduced-motion behavior before checkpointing.

- [x] Emulate prefers-reduced-motion and confirm the nav remains visible without hide/show animation. (Verified via live stylesheet inspection and top-state runtime check.)
- [x] Save a checkpoint after reduced-motion verification of the refined glass nav.
