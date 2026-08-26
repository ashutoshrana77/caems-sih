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
