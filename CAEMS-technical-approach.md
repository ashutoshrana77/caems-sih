# CAEMS SIH 2026 / NDD — Technical Approach

## 1. Executive summary

CAEMS, the Community-AI Emergency Management System, is implemented as a public-facing React experience backed by a full-stack TypeScript application. The technical approach combines an editorial emergency-operations narrative with an interactive prototype: a citizen preparedness view, an authority command view, simulated incident movement, multilingual labels, SMS fallback states, a pilot-interest submission flow, and a server-side Gemini assistant.

The implementation prioritizes low-friction field use, explicit state transitions, typed contracts, graceful degradation, and a clear demonstration path from an official warning to coordinated action. The current project has been restored to checkpoint `9121ea10`, represented by the active rollback version `bb92d637`.

> **Checkpoint note:** The restored version contains the full-stack demo, pilot backend, simulator, language and SMS states, Gemini integration, and copyright-policy update. Later or earlier checkpoint-specific changes should be verified against the current source before production use.

## 2. Architecture overview

The project uses a single-repository, full-stack TypeScript architecture. The browser renders the public CAEMS site, while an Express server exposes typed tRPC procedures under `/api/trpc`. Drizzle ORM maps TypeScript schema definitions to the MySQL/TiDB-compatible database. The client and server share the tRPC router type, so procedure inputs and outputs remain synchronized at compile time.

| Layer | Technology or approach | CAEMS responsibility |
|---|---|---|
| Presentation | React 19 + TSX | Renders the public SIH showcase and operational evidence views. |
| Styling | Tailwind CSS 4 plus project CSS | Implements the Monsoon Ledger visual system, responsive layout, dossier annotations, overlays, and state styling. |
| UI primitives | Radix/shadcn-style components and Lucide icons | Provides accessible dialogs, scrolling, buttons, controls, and operational iconography. |
| Client data | TanStack React Query + tRPC React | Manages mutation lifecycle, loading/error states, and typed server communication. |
| RPC transport | tRPC 11 + `httpBatchLink` + SuperJSON | Transports typed procedures through `/api/trpc` and serializes data. |
| Server | Express 4 through the managed full-stack template | Hosts API procedures, OAuth callbacks, static assets, and runtime integrations. |
| Data | Drizzle ORM + MySQL/TiDB database | Persists users and pilot-interest leads. |
| Authentication | Manus OAuth scaffold | Provides session-aware infrastructure and login fallback. |
| AI | Google AI Studio Gemini REST API | Powers the CAEMS Assist chatbot through a server-only key path. |
| Testing | Vitest + TypeScript compiler | Validates contracts, helper behavior, authentication, and builds. |
| Delivery | Managed WebDev hosting and GitHub remote | Provides previews, checkpoints, rollback, deployment, and repository synchronization. |

The client bootstrap in `client/src/main.tsx` creates a shared React Query client and tRPC client, enables SuperJSON, sends credentials to `/api/trpc`, and forwards a mirrored preview session token from `sessionStorage` when browser cookie policies interfere with the normal flow. Query and mutation errors are observed centrally; unauthenticated errors can initiate the OAuth login helper. [1]

## 3. Frontend technical approach

### 3.1 Single-page information architecture

CAEMS is implemented as a public-facing single-page experience rather than an internal dashboard shell. The main sequence presents the emergency-management story in operational order: map-led hero, response gap, three emergency moments, last-mile design, citizen and authority views, pilot targets, preparedness drills, and supporting build/policy content.

The navigation uses section anchors such as `#system`, `#response`, and `#stack`. Buttons use smooth scrolling or open explicit action states. This reduces the number of steps required in an SIH judging demonstration and ensures that every prominent CTA explains or opens a system capability.

### 3.2 React state model

The main `Home` component coordinates prototype state with React hooks. The principal state variables are:

| State | Purpose |
|---|---|
| `menuOpen` | Opens and closes responsive navigation. |
| `activeMode` | Switches between the citizen and authority operating views. |
| `activeAction` | Opens contextual panels such as safe route, pilot briefing, drill toolkit, or SOS confirmation. |
| `drillRole` | Tracks the selected drill participant role. |
| `sosHeld` | Represents an active press-and-hold SOS interaction. |
| `language` | Selects English, Hindi, or Marathi copy. |
| `smsStatus` / `smsAttempt` | Drives the SMS fallback state machine. |
| `liveMapOn` / `mapTick` | Drives the timed authority-map simulation. |
| `chatOpen` / `chatMessages` | Controls the Gemini assistant drawer and local conversation history. |

This deliberately separates persisted business data from local demo state. Pilot interest is sent to the database, while the map movement, SOS progression, translation switching, and SMS delivery result are local prototype states intended to make the product behavior visible and repeatable during judging.

### 3.3 Reusable components and icons

The page uses small helpers such as `SectionLabel` and `Metric` for repeated visual patterns. Lucide icons represent weather, SOS, routes, databases, community users, radio channels, health, and authority operations. The existing `AIChatBox` component is reused for chat rendering rather than duplicating the assistant UI. It supports suggested prompts, Enter-to-send behavior, auto-scroll, loading feedback, and Streamdown rendering for assistant replies. [2]

### 3.4 Responsive and low-bandwidth design

The visual system alternates between deep ink, sand, cloud, teal, and safety-orange surfaces. Map imagery, route traces, coordinate labels, field notes, incident pins, stamps, and dossier-like evidence blocks create a field-manual identity rather than a generic SaaS dashboard.

The UX treats connectivity as a design constraint. The copy and evidence screens demonstrate offline map readiness, compressed damage reports, multilingual flows, GPS SOS, push/pull channels, and SMS fallback. Large media files are referenced from managed storage URLs rather than copied into the project bundle, which keeps the deployable project smaller and avoids local asset packaging problems.

## 4. Emergency-management interaction model

### 4.1 Citizen and authority views

The `activeMode` state creates two views of one operating picture. The citizen view is presented as a phone-shaped evidence module containing a rainfall alert, safe-route control, SMS fallback, readiness checklist, language selector, and press-and-hold SOS control. The authority view uses a command-dashboard treatment containing incident markers, counts, status labels, and a live simulation switch.

The mode switch is implemented with explicit buttons. Hero and content-level actions can set the intended mode and scroll to the dashboard, reducing navigation friction during a presentation.

### 4.2 Press-and-hold SOS

The SOS control uses pointer and keyboard events rather than a single click. Pointer-down begins a hold state, a timer completes the action after approximately 1.2 seconds, and pointer-up or pointer-leave cancels it. Enter and Space are also supported through matching key-down and key-up handlers. Completion produces visible feedback that the SOS was queued with GPS and SMS fallback.

This protects a high-consequence action from accidental taps while giving the user immediate feedback that the control is actively listening.

### 4.3 SMS fallback finite-state machine

The SMS demonstration is modeled as a small finite-state machine with `idle`, `sending`, `retrying`, `failed`, and `sent` states. The first attempt demonstrates a failed delivery path; the next action enters retrying and then sent. A sent state can be reset for another judging cycle.

The approach makes resilience visible without depending on a live SMS vendor. A production implementation would replace the local timer with a provider job, delivery receipt, retry policy, and audit record.

### 4.4 Live authority-map simulator

When enabled, the authority view starts a 2.5-second interval through `useEffect`. Each tick increments `mapTick`, which changes marker positions and updates the auto-sync label. The simulator is deterministic and local. It is intentionally not presented as a real incident feed.

For production, the interval should be replaced by WebSocket, Server-Sent Events, or a managed realtime channel. Each event should carry incident identity, source confidence, timestamp, geospatial data, and authorization context.

### 4.5 Multilingual content state

The citizen evidence screen uses a typed language union of `EN`, `HI`, and `MR`. A language-copy object maps the selected language to alert title, alert body, route label, readiness label, offline-map label, checklist label, completion label, SOS label, and authority labels. This models translation as data rather than duplicated markup.

A production version should move the strings into reviewed message catalogs, add pluralization and locale-specific formatting, and provide a translation review workflow for public-health terminology.

## 5. Backend and data approach

### 5.1 tRPC-first API contract

The backend procedures are defined in `server/routers.ts`. `pilot.create` and `chatbot.ask` are public procedures because the SIH landing experience is intended to accept pilot interest and demonstrate the assistant without forcing visitors through login.

Zod validates procedure inputs before business logic executes. Pilot submissions require a name of at least two characters, an organisation of at least two characters, and a valid email address. Chat messages require one to twelve messages, a `user` or `assistant` role, non-empty trimmed content, and a per-message maximum of 4,000 characters. [4]

### 5.2 Pilot-interest persistence

The `pilotInterests` table contains an auto-incrementing ID, name, organisation, email, source marker, and database timestamp. `createPilotInterest` lazily obtains a Drizzle connection and inserts a validated lead with source `sih-2026-ndd`. The procedure returns `{ success: true }` after the insert completes.

Lazy connection initialization allows local tooling to load without opening a database connection immediately. If the database is unavailable during a real submission, the mutation returns an error rather than claiming that the lead was stored.

### 5.3 Schema-first migration

The database model is defined in `drizzle/schema.ts`; Drizzle Kit generates migration SQL; and the migration is applied through the managed database workflow. This keeps the TypeScript schema and deployed database table aligned. The CAEMS implementation uses non-destructive schema changes.

The current pilot table is intentionally minimal. A production pipeline should add consent timestamp, submission status, source campaign, review owner, follow-up notes, and possibly a user relationship.

## 6. Gemini AI approach

### 6.1 Server-only credential

The Google AI Studio API key is read through server environment configuration in `server/_core/env.ts`. The browser calls `chatbot.ask`; only the server contacts Google. The key is therefore not placed in React source, browser storage, or the client bundle.

### 6.2 CAEMS-specific system instruction

The Gemini helper defines CAEMS Assist as a calm emergency-management guide for citizens, volunteers, and district authorities. The instruction requests concise preparedness and response guidance, prohibits invented live alerts, locations, rescue availability, or official instructions, directs users in immediate danger to local emergency services and official authorities, identifies the assistant as a demo when relevant, and asks it to answer in the user’s language.

This is a safety boundary, not an authorization system. Production use should add verified district retrieval, citations, escalation rules, operational permissions, audit logging, and explicit separation between simulated and authoritative information.

### 6.3 Request shaping and parsing

The helper maps application `assistant` turns to Gemini’s `model` role, limits history to the most recent twelve messages, clips each message to 4,000 characters, and sends a `generateContent` request with a low temperature and bounded output. It extracts text from `candidates[0].content.parts`, joins multiple parts, trims the result, and rejects an empty response. [5]

The later Gemini repair changed the hardcoded model after a live Google response reported that the prior model was unavailable to new users. The repair targeted `gemini-3.6-flash`, verified the provider response with HTTP 200, and confirmed the typed `/api/trpc/chatbot.ask` path returned assistant text. If the current restored source differs, check the active `server/googleAI.ts` before testing.

### 6.4 Chat UI behavior

The page stores a local user/assistant conversation and sends the bounded history to the typed mutation. The assistant drawer includes suggested prompts, loading feedback, error feedback, and markdown-friendly response rendering. The later repair also surfaced provider error text in the assistant error state while retaining the instruction to follow official emergency guidance for urgent situations.

## 7. Authentication and runtime integration

The full-stack template includes Manus OAuth. `client/src/main.tsx` observes query and mutation errors and invokes the login helper for the unauthenticated error condition. It also supports preview environments where iframe cookie restrictions prevent normal cookie reads by forwarding a mirrored session token from `sessionStorage` as a Bearer token.

The public CAEMS experience does not require login for the visible landing page, pilot interest, or assistant demonstration. That choice reduces friction for judges and pilot partners. Future authority operations should be protected by explicit roles and permissions instead of inheriting public access.

## 8. Error handling and resilience

Mutation callbacks cover loading, success, and failure behavior for pilot and chatbot flows. Toasts acknowledge local demo actions such as opening the authority view, queuing SOS, changing SMS status, and opening the drill toolkit.

The implementation distinguishes simulated failures from real failures. SMS failure is intentionally generated to demonstrate recovery, whereas database and Gemini failures originate from actual backend/provider calls. Labels should remain explicit so demo states are not mistaken for live operational information.

## 9. Testing and verification

The project uses TypeScript compilation and Vitest. The suite covers authentication logout behavior, pilot validation, chatbot input limits, and mocked Gemini response shaping. The pilot tests reject short names, short organisations, and invalid emails. Chatbot tests reject empty content and histories above twelve messages.

| Verification layer | Coverage |
|---|---|
| TypeScript `check` | Type correctness across React, tRPC, server code, schema types, and imports. |
| Vitest | Auth logout, pilot input contracts, chatbot message constraints, and Gemini response shaping. |
| Production build | Vite client bundle and esbuild server bundle. |
| Preview capture | Visual hierarchy, responsive evidence layouts, assistant launcher, and operational states. |
| Live API check | Direct Gemini response and `/api/trpc/chatbot.ask` response path. |
| Server logs | Startup, OAuth initialization, API errors, and runtime diagnostics. |

During development, stale TypeScript watcher processes caused memory pressure during bundling. The mitigation was to stop stale watchers, run the production build separately, and restart the managed server afterward. This is a development-environment issue, not an intended application dependency.

## 10. Assets and deployment

The visual set contains a dark operational hero map, a satellite-risk texture, a community drill image, and a CAEMS mark. Assets are generated/stored outside the source tree and referenced through managed storage paths such as `/manus-storage/...`. This reduces deployment packaging risk and gives the deployed site stable asset references.

The managed project uses an autoscale server-capable template after the backend upgrade. Checkpoints snapshot source, dependencies, and project metadata; with auto-publish enabled, a successful checkpoint also publishes the project. The connected GitHub synchronization reported no uncommitted changes at the time of the last sync.

## 11. Approaches deliberately not used

The public experience does not use a persistent sidebar dashboard because it is a marketing and judging surface rather than an internal authority tool. The live map is not yet a real-time operational feed; it is deterministic local simulation. The chatbot does not authorize dispatch, access verified incident feeds, or issue official instructions. The pilot form persists a validated backend record but does not itself send email.

The reported “Made with Manus” text was not found in CAEMS-owned JSX, HTML, JavaScript, metadata, or the rendered page DOM. The observed badge was identified as a platform or preview overlay rather than application content.

## 12. Recommended production evolution

The next phase should turn prototype boundaries into explicit services. Add an authenticated authority console with role-based access, incident CRUD, task assignment, audit history, and administrative review of pilot submissions. Replace the local map interval with a realtime event service and verified geospatial pipeline. Add retrieval from district-approved advisories and multilingual content, including citations and escalation rules. Connect the pilot procedure to a transactional email provider only after provider credentials, consent copy, and retry behavior are defined. Finally, add browser end-to-end tests for SOS hold/cancel, SMS retry, mode switching, pilot submission, and chatbot error recovery.

## 13. Project source map

| Concern | Primary files |
|---|---|
| Public experience | `client/src/pages/Home.tsx` |
| Visual system | `client/src/index.css` |
| Providers and routing | `client/src/App.tsx`, `client/src/main.tsx` |
| Assistant UI | `client/src/components/AIChatBox.tsx` |
| Typed client binding | `client/src/lib/trpc.ts` |
| Server procedures | `server/routers.ts` |
| Gemini helper | `server/googleAI.ts` |
| Database schema | `drizzle/schema.ts` |
| Database helpers | `server/db.ts` |
| Environment/runtime | `server/_core/env.ts`, `server/_core/context.ts`, `server/_core/trpc.ts` |
| Contract tests | `server/pilot.test.ts`, `server/chatbot.test.ts`, `server/googleAI.test.ts` |
| Auth test | `server/auth.logout.test.ts` |
| Browser metadata | `client/index.html` |

## References

[1]: client/src/main.tsx "CAEMS client bootstrap and tRPC configuration"
[2]: client/src/components/AIChatBox.tsx "Reusable CAEMS assistant UI"
[3]: client/src/pages/Home.tsx "CAEMS public experience and interactive prototype"
[4]: server/routers.ts "CAEMS tRPC procedures and Zod contracts"
[5]: server/googleAI.ts "Server-side Google AI Studio Gemini helper"
[6]: drizzle/schema.ts "CAEMS Drizzle database schema"
[7]: server/db.ts "CAEMS database connection and persistence helpers"
[8]: server/pilot.test.ts "Pilot-interest validation tests"
[9]: server/chatbot.test.ts "Chatbot input contract tests"
[10]: client/src/index.css "CAEMS visual and responsive styles"
