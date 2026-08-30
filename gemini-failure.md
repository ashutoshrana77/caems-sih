# Gemini failure reproduction

The current preview and published site expose the CAEMS Assist launcher. A browser click on the visible launcher did not produce an opened drawer in the returned browser snapshot, so the failure is reproducible at the UI interaction layer. Server logs contained no Gemini request or chatbot route error during this attempt, suggesting the click was not reaching the React handler in the browser harness or the request was never emitted.

A runtime inspection found the `Open CAEMS Assist` button, but invoking `.click()` returned `drawer: false` and no textarea. One prior attempt also hit a console syntax issue. This points to a client-side runtime or event-binding problem rather than a Google API response problem; the browser harness may be showing stale or non-hydrated preview markup.

Browser console inspection found no explicit `onclick` property or React key output for the launcher element. No runtime exception appeared in the console. The page appears to be a preview harness snapshot rather than a normal hydrated client context, so the harness cannot reliably validate the React click handler. Server tests remain the reliable route-level evidence; the next repair focuses on making the server request and client error state more diagnostic.

After switching the helper to `gemini-3.6-flash`, a real POST to `/api/trpc/chatbot.ask?batch=1` from the live CAEMS preview returned HTTP 200 with Gemini text: `READY. CAEMS Assist is online and ready to provide emergency preparedness and response guidance. Please note that I am a demo assistant.` The API key and server procedure are working end to end.
