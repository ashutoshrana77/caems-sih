// Monsoon Ledger reminder: this page uses an editorial field-manual layout, deep ink surfaces, monsoon teal routes, and safety orange only for risk/action.
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AIChatBox } from "@/components/AIChatBox";
import { ArrowUpRight, Bell, Check, ChevronRight, CloudRain, Crosshair, Database, Flame, Globe2, HeartPulse, Menu, MessageCircle, Radio, Route, ShieldCheck, Signal, Siren, Smartphone, Users, X } from "lucide-react";

const heroMap = "/manus-storage/caems-hero-map_75937bf5.jpg";
const satelliteRisk = "/manus-storage/caems-satellite-risk_228fbb9d.jpg";
const communityDrill = "/manus-storage/caems-community-drill_0a0ed708.jpg";
const mark = "/manus-storage/caems-mark_3ad914e1.png";


function SectionLabel({ index, children }: { index: string; children: string }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navFocused, setNavFocused] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [activeMode, setActiveMode] = useState<"citizen" | "authority">("citizen");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [drillRole, setDrillRole] = useState("Community volunteer");
  const [sosHeld, setSosHeld] = useState(false);
  const [language, setLanguage] = useState<"EN" | "HI" | "MR">("EN");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "retrying" | "sent" | "failed">("idle");
  const [smsAttempt, setSmsAttempt] = useState(0);
  const [liveMapOn, setLiveMapOn] = useState(false);
  const [mapTick, setMapTick] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([{ role: "assistant", content: "I’m CAEMS Assist. Ask me about preparedness, safe routes, offline readiness, or district response workflows." }]);
  const chatbotMutation = trpc.chatbot.ask.useMutation();
  const sosTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pilotMutation = trpc.pilot.create.useMutation();
  useEffect(() => {
    let lastY = window.scrollY;
    let rafId: number | null = null;
    let stopTimer: number | null = null;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateVisibility = () => {
      if (reducedMotionQuery.matches || navFocused) {
        setNavHidden(false);
        return;
      }
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (currentY <= 8 || delta < 0) setNavHidden(false);
      if (delta > 0 && currentY > 8) setNavHidden(true);
      lastY = currentY;
      if (stopTimer) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => setNavHidden(false), 180);
    };
    const onMotionPreferenceChange = () => {
      if (reducedMotionQuery.matches) setNavHidden(false);
    };
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateVisibility();
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    reducedMotionQuery.addEventListener?.("change", onMotionPreferenceChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      reducedMotionQuery.removeEventListener?.("change", onMotionPreferenceChange);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (stopTimer) window.clearTimeout(stopTimer);
    };
  }, [navFocused]);
  const languageCopy = { EN: { alert: "Heavy rainfall advisory", body: "Ward 08–12 · Moderate flood risk predicted in next 3 hours.", route: "View safe route", readiness: "YOUR READINESS", map: "Offline map downloaded", checklist: "Household checklist", done: "DONE", sos: "HOLD FOR SOS", live: "DISTRICT COMMAND / LIVE", sync: "Simulation paused", openSos: "OPEN SOS", volunteers: "VOLUNTEERS ACTIVE", inventory: "RELIEF INVENTORY" }, HI: { alert: "भारी वर्षा चेतावनी", body: "वार्ड 08–12 · अगले 3 घंटों में मध्यम बाढ़ का अनुमान।", route: "सुरक्षित मार्ग देखें", readiness: "आपकी तैयारी", map: "ऑफ़लाइन मानचित्र डाउनलोड", checklist: "परिवार चेकलिस्ट", done: "पूरा", sos: "SOS के लिए दबाकर रखें", live: "जिला कमांड / लाइव", sync: "सिमुलेशन रुका है", openSos: "खुले SOS", volunteers: "सक्रिय स्वयंसेवक", inventory: "राहत सूची" }, MR: { alert: "मुसळधार पावसाचा इशारा", body: "वॉर्ड 08–12 · पुढील 3 तासांत मध्यम पूराचा अंदाज.", route: "सुरक्षित मार्ग पहा", readiness: "तुमची तयारी", map: "ऑफलाइन नकाशा डाउनलोड", checklist: "कुटुंब चेकलिस्ट", done: "पूर्ण", sos: "SOS साठी धरून ठेवा", live: "जिल्हा कमांड / लाइव्ह", sync: "सिम्युलेशन थांबले", openSos: "उघडे SOS", volunteers: "सक्रिय स्वयंसेवक", inventory: "मदत साठा" } }[language];
  const runAction = (label: string) => { if (label === "Live demo") { setActiveAction(null); setActiveMode("authority"); toast("Authority command view opened."); setTimeout(() => document.querySelector(".dashboard-section")?.scrollIntoView({ behavior: "smooth" }), 0); return; } if (label === "Citizen app preview") { setActiveAction(null); setActiveMode("citizen"); toast("Citizen app view opened."); setTimeout(() => document.querySelector(".dashboard-section")?.scrollIntoView({ behavior: "smooth" }), 0); return; } setActiveAction(label); toast(`${label} demo opened.`); };
  const beginSOS = () => { setSosHeld(true); sosTimer.current = setTimeout(() => { setSosHeld(false); setActiveAction("SOS sent"); toast("SOS queued with GPS and SMS fallback."); }, 1200); };
  const cancelSOS = () => { if (sosTimer.current) clearTimeout(sosTimer.current); setSosHeld(false); };
  const simulateSms = () => { if (smsStatus === "sent") { setSmsAttempt(0); setSmsStatus("idle"); return; } setSmsStatus(smsAttempt === 0 ? "sending" : "retrying"); setTimeout(() => { if (smsAttempt === 0) { setSmsAttempt(1); setSmsStatus("failed"); toast("SMS fallback failed in the demo. Tap retry to send again."); } else { setSmsStatus("sent"); toast("SMS fallback sent to registered households."); } }, 900); };
  const sendChat = (content: string) => { const nextMessages = [...chatMessages, { role: "user" as const, content }]; setChatMessages(nextMessages); chatbotMutation.mutate({ messages: nextMessages }, { onSuccess: (response) => setChatMessages((current) => [...current, { role: "assistant", content: response.text }]), onError: (error) => setChatMessages((current) => [...current, { role: "assistant", content: `Gemini is unavailable right now (${error.message}). Please try again in a moment, or follow your local authority’s official instructions for urgent situations.` }]) }); };
  useEffect(() => { if (!liveMapOn) return; const timer = setInterval(() => setMapTick((tick) => tick + 1), 2500); return () => clearInterval(timer); }, [liveMapOn]);

  return (
    <div className="site-shell">
      <header ref={navRef} className={navHidden && !navFocused ? "topbar nav-hidden" : "topbar"} onFocus={() => setNavFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setNavFocused(false); }}>

        <a className="brand" href="#top" aria-label="CAEMS home">
          <img src={mark} alt="" className="brand-mark" />
          <span><b>CAEMS</b><em>Community-AI / Emergency Management</em></span>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#identity" onClick={() => setMenuOpen(false)}>Identity</a>
          <a href="#security" onClick={() => setMenuOpen(false)}>Security</a>
          <a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a>
          <button className="nav-cta" onClick={() => runAction("Pilot briefing")}>Request Demo <ArrowUpRight size={15} /></button>
        </nav>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-map" style={{ backgroundImage: `url(${heroMap})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow"><span className="live-dot" /> SIH 2026 / NDD · HEALTH EMERGENCY TRACK</div>
            <h1>When the warning lands,<br /><i>the response starts.</i></h1>
            <p className="hero-copy">CAEMS connects localized risk intelligence with the people who need to act—before, during, and after an emergency. Built for districts where every minute, megabyte, and volunteer counts.</p>
            <div className="hero-actions">
              <button className="btn btn-orange" onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}>See how it works <ArrowUpRight size={17} /></button>
              <button className="text-link" onClick={() => runAction("Live demo")}>Explore the command view <ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="hero-stamp"><span>FIELD NOTE 01</span><strong>Warning →<br />coordinated action</strong><small>Prepared for low-bandwidth districts</small></div>
          <div className="hero-coordinates">20°35'12"N &nbsp; 78°57'31"E<br /><span>MONSOON WATCH / ACTIVE</span></div>
        </section>

        <section className="intro-strip dossier-light">
          <div className="intro-kicker">THE GAP <small className="coord-note">FIELD NOTE / 00—A</small></div>
          <div className="intro-body"><h2>Most systems stop at the alert.<br /><em>CAEMS stays for the work after.</em></h2><p>Official warnings are essential. But a district also needs verified ground reports, clear task ownership, rescue coordination, and a record of what changed. CAEMS is the operational layer between a notification and a safer recovery.</p></div>
        </section>

        <section className="section" id="features">
          <SectionLabel index="01" children="A connected emergency system" />
          <div className="section-heading"><h2>One platform.<br /><em>Three moments that matter.</em></h2><p>From early signals to impact analytics, every layer is designed around the realities of community response: shared phones, patchy networks, multiple languages, and limited infrastructure.</p></div>
          <div className="system-grid">
            <article className="system-card card-dark"><div className="card-index">01 / PREPARE</div><div className="card-icon teal"><CloudRain /></div><h3>See risk earlier</h3><p>Satellite imagery, weather feeds, hazard records, and community reports combine into explainable neighborhood-level risk maps.</p><div className="mini-map"><div className="mini-route" /><span className="mini-pin pin-a" /><span className="mini-pin pin-b" /><span className="map-tag">FLOOD INDEX / 0.72</span></div><span className="card-footer">SATELLITE + OPENWEATHER <ArrowUpRight size={15} /></span></article>
            <article className="system-card card-sand"><div className="card-index">02 / RESPOND</div><div className="card-icon orange"><Siren /></div><h3>Move help with context</h3><p>Authorities see live incidents, assign volunteers, route resources, and keep an auditable view of what is verified.</p><div className="task-stack"><div><span className="status orange-dot" /> SOS-184 <b>Rescue team assigned</b><small>Ward 08 · 2 min ago</small></div><div><span className="status teal-dot" /> R-029 <b>Medical kit en route</b><small>PHC North · 6 min ago</small></div></div><span className="card-footer">COMMAND DASHBOARD <ArrowUpRight size={15} /></span></article>
            <article className="system-card card-teal"><div className="card-index">03 / RECOVER</div><div className="card-icon sand"><Database /></div><h3>Learn from every event</h3><p>Damage reports, relief inventory, drills, and feedback close the loop—so the next response starts stronger.</p><div className="recovery-stat"><strong>+20%</strong><span>target improvement<br />over baseline maps</span></div><span className="card-footer">IMPACT ANALYTICS <ArrowUpRight size={15} /></span></article>
          </div>
        </section>

        <section className="response-section" id="identity">
          <div className="response-visual"><img src={satelliteRisk} alt="Topographic risk map texture" /><div className="visual-caption"><span>RISK LAYER / 04</span><strong>Explainable signals.<br />Actionable routes.</strong></div></div>
          <div className="response-copy"><SectionLabel index="02" children="Designed for the last mile" /><h2>Built to keep working<br /><em>when networks don’t.</em></h2><p>CAEMS treats connectivity as a design constraint, not an edge case. The app caches what people need before they need it, then falls back to the simplest channel available.</p><div className="capability-list"><div><span><Smartphone /></span><p><b>Offline-first citizen app</b>Pre-downloaded evacuation maps, checklists, compressed damage reports, and one-tap GPS SOS.</p></div><div><span><Radio /></span><p><b>Push, pull, SMS fallback</b>Alerts reach registered households through Firebase notifications, SMS, and future IVR pathways.</p></div><div><span><Users /></span><p><b>Community-ready UX</b>Multilingual flows, role-based drill templates, and simple guides for schools, health centers, and volunteers.</p></div></div><button className="text-link teal-link" onClick={() => runAction("Citizen app preview")}>Preview the citizen journey <ChevronRight size={16} /></button></div>
        </section>

        <section className="dashboard-section dossier-light" id="security">
          <div className="dossier-trace trace-top"><span className="trace-point" /></div><div className="dashboard-head"><div><SectionLabel index="03" children="Two views. One operating picture." /><h2>Right information,<br /><em>right person.</em></h2></div><div className="mode-switch"><button className={activeMode === "citizen" ? "active" : ""} onClick={() => setActiveMode("citizen")}><Smartphone size={15} /> Citizen app</button><button className={activeMode === "authority" ? "active" : ""} onClick={() => setActiveMode("authority")}><Globe2 size={15} /> Authority view</button></div></div>
          {activeMode === "citizen" ? <div className="phone-evidence"><div className="evidence-note note-left"><span>DEVICE / CITIZEN 01</span><b>Offline ready</b><small>Last map sync<br />08:39 · Ward 08</small></div><div className="phone-demo"><div className="phone-notch" /><div className="phone-top"><span>CAEMS</span><Signal size={14} /></div><div className="language-switch" aria-label="Alert language"><span>ALERT LANGUAGE</span>{(["EN", "HI", "MR"] as const).map((code) => <button key={code} className={language === code ? "active" : ""} onClick={() => setLanguage(code)}>{code}</button>)}</div><div className="phone-alert"><div className="alert-top"><span className="live-dot" /> LIVE ALERT <small>08:42</small></div><h3>{languageCopy.alert}</h3><p>{languageCopy.body}</p><button onClick={() => runAction("Safe route")}>{languageCopy.route} <ArrowUpRight size={14} /></button><button className="sms-fallback" onClick={simulateSms} disabled={smsStatus === "sending" || smsStatus === "retrying"}>{smsStatus === "sent" ? "SMS FALLBACK SENT · TAP TO RESET" : smsStatus === "sending" ? "SENDING SMS…" : smsStatus === "retrying" ? "RETRYING SMS…" : smsStatus === "failed" ? "SMS FAILED · RETRY" : "TRY SMS FALLBACK"}<Radio size={14} /></button></div><div className="phone-section-title">{languageCopy.readiness}</div><div className="phone-check"><Check /> <span>{languageCopy.map}</span><b>{languageCopy.done}</b></div><div className="phone-check"><Check /> <span>{languageCopy.checklist}</span><b>6 / 8</b></div><button className={sosHeld ? "sos-button holding" : "sos-button"} onPointerDown={beginSOS} onPointerUp={cancelSOS} onPointerLeave={cancelSOS} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") beginSOS(); }} onKeyUp={(event) => { if (event.key === "Enter" || event.key === " ") cancelSOS(); }} aria-label="Hold to send SOS"> <Crosshair size={17} /> {sosHeld ? "KEEP HOLDING…" : languageCopy.sos}</button></div></div> : <div className="authority-demo"><div className="dash-top"><span><span className="live-dot" /> {languageCopy.live}</span><small>{liveMapOn ? `Auto-sync ${mapTick + 1} · 2.5s` : languageCopy.sync}</small><button className="live-toggle" onClick={() => setLiveMapOn((enabled) => !enabled)}>{liveMapOn ? "PAUSE LIVE SIM" : "START LIVE SIM"}</button></div><div className="dash-grid"><div className="dash-map"><div className="map-grid-lines" /><span className="dash-route" /><span className="dash-pin dp1" /><span className="dash-pin dp2" /><span className="dash-pin dp3" style={{ top: `${85 + (mapTick % 3) * 24}px`, left: `${590 - (mapTick % 2) * 44}px` }} /><div className="map-legend"><span><i className="orange-bg" /> active incident</span><span><i className="teal-bg" /> safe route</span></div></div><div className="dash-side"><div className="dash-stat"><small>{languageCopy.openSos}</small><strong>{18 + (mapTick % 4)}</strong><span className="up">+4 today</span></div><div className="dash-stat"><small>{languageCopy.volunteers}</small><strong>64</strong><span>of 82 registered</span></div><div className="dash-stat"><small>{languageCopy.inventory}</small><strong>76%</strong><span className="warn">2 items low</span></div></div></div></div>}
        </section>

        <section className="metrics-section dossier-teal"><SectionLabel index="04" children="Pilot targets" /><div className="metrics-grid"><Metric value="80%" label="alert reach" detail="registered users within 2 min" /><Metric value="−30%" label="coordination time" detail="task assignment to action" /><Metric value="+20%" label="risk accuracy" detail="over baseline heuristic maps" /><Metric value="1 loop" label="community feedback" detail="drills → data → readiness" /></div></section>

        <section className="engage-section" id="blog"><div className="engage-copy"><SectionLabel index="05" children="Resilience is practiced" /><h2>Preparedness is not a push notification.<br /><em>It is a shared habit.</em></h2><p>CAEMS gives communities a simple rhythm: run the drill, check the route, report what changed, and make the next plan more local than the last one.</p><button className="btn btn-orange" onClick={() => runAction("Drill toolkit")}>Open the drill toolkit <ArrowUpRight size={17} /></button></div><div className="engage-image"><img src={communityDrill} alt="Community volunteers reviewing an evacuation map" /><div className="image-note">FIELD NOTE 05<br /><strong>Training turns<br />systems into trust.</strong></div></div></section>

        <section className="stack-section dossier-light" id="stack"><div className="dossier-stamp">POLICY / 06<br /><strong>CONTENT RIGHTS</strong></div><SectionLabel index="06" children="Copyright policy" /><div className="stack-layout"><div><h2>Respect the work.<br /><em>Use it responsibly.</em></h2><p>This copyright and content-use policy explains how CAEMS materials may be viewed, shared, and reused. It is a working website policy for the SIH 2026 / NDD project and should be reviewed by qualified counsel before formal adoption.</p></div><div className="stack-table policy-table"><div><span>01 / Ownership</span><b>© 2026 Team Logic Lords. All rights reserved. Text, graphics, logos, images, code, and media created for CAEMS are protected by applicable intellectual-property laws.</b></div><div><span>02 / Permitted use</span><b>Visitors may view the site, share links, and download or print material for personal, educational, or non-commercial evaluation with attribution.</b></div><div><span>03 / Prohibited use</span><b>Do not scrape, republish, sell, modify, frame, redistribute, or use CAEMS content, branding, or code commercially without prior written permission.</b></div><div><span>04 / User content</span><b>If users submit comments, reports, or media, they retain ownership and grant CAEMS a non-exclusive license to host, display, adapt, and distribute that submission for project operations.</b></div><div><span>05 / Takedown</span><b>Designated Copyright Agent: Team Logic Lords. Submit a copyright notice by calling 9458616977, 6396841380, or 7017431339 with your name, contact details, the original work, the allegedly infringing URL, proof of rights, and a good-faith statement.</b></div><div><span>06 / Counter-notice</span><b>A person whose material was removed may submit a counter-notification identifying the material, the original location, contact details, and a good-faith belief that removal was mistaken.</b></div><div><span>07 / Open licenses</span><b>Any material expressly marked MIT, Creative Commons, or another open license is governed by that license. All unmarked CAEMS material remains all rights reserved.</b></div><div><span>08 / Attribution</span><b>Made by Team Logic Lords for SIH 2026 / NDD. Contact: 9458616977 · 6396841380 · 7017431339.</b></div></div></div></section>

        <section className="difference-section dossier-light"><div className="dossier-trace trace-bottom"><span className="trace-point" /></div><div className="difference-mark">CAEMS<br /><span>≠</span><br />SACHET</div><div><SectionLabel index="07" children="Why CAEMS" /><h2>Not another alert inbox.<br /><em>An action layer.</em></h2><p>SACHET delivers authorized, geo-targeted disaster warnings across official channels and multiple Indian languages. CAEMS is designed for what happens next: verified ground reports, SOS management, rescue team assignment, relief tracking, and local feedback.</p><div className="difference-points"><span><Check size={15} /> Warning distribution</span><span><Check size={15} /> Ground verification</span><span><Check size={15} /> Task coordination</span><span><Check size={15} /> Recovery analytics</span></div></div></section>

        <section className="final-cta"><div className="final-grid" /><div className="eyebrow"><span className="live-dot" /> COMMUNITY-AI / EMERGENCY MANAGEMENT</div><h2>Make the next<br /><i>minute count.</i></h2><p>CAEMS is a proposal for a more connected kind of readiness—one that starts with a signal and ends with people moving together.</p><button className="btn btn-orange" onClick={() => runAction("CAEMS pilot briefing")}>Talk to the team <ArrowUpRight size={17} /></button></section>
      </main>
      <footer><a className="brand" href="#top"><img src={mark} alt="" className="brand-mark" /><span><b>CAEMS</b><em>SIH 2026 / NDD</em></span></a><span>Community-AI Emergency Management System</span><span>Built for resilient districts.</span></footer>
      <button className="chatbot-launch" onClick={() => setChatOpen((open) => !open)} aria-label={chatOpen ? "Close CAEMS Assist" : "Open CAEMS Assist"}><MessageCircle size={18} /><span>{chatOpen ? "Close assistant" : "CAEMS Assist"}</span></button>
      {chatOpen && <aside className="chatbot-drawer" aria-label="CAEMS Assist"><div className="chatbot-drawer-head"><div><span className="live-dot" /> CAEMS ASSIST</div><button onClick={() => setChatOpen(false)} aria-label="Close assistant"><X size={17} /></button></div><AIChatBox messages={chatMessages} onSendMessage={sendChat} isLoading={chatbotMutation.isPending} height="460px" emptyStateMessage="Ask CAEMS about emergency readiness" suggestedPrompts={["How do I prepare for flooding?", "What should an authority dashboard track?", "How does offline SOS work?"]} /></aside>}
      {activeAction && <div className="action-overlay" role="dialog" aria-modal="true" aria-label={activeAction} onClick={() => setActiveAction(null)}><div className="action-panel" onClick={(event) => event.stopPropagation()}><button className="close-action" onClick={() => setActiveAction(null)} aria-label="Close"><X size={18} /></button><div className="eyebrow"><span className="live-dot" /> CAEMS / DEMO ACTION</div><h3>{activeAction}</h3>{activeAction === "Pilot briefing" || activeAction === "CAEMS pilot briefing" ? <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); pilotMutation.mutate({ name: String(data.get("name") ?? ""), organisation: String(data.get("organisation") ?? ""), email: String(data.get("email") ?? "") }, { onSuccess: () => { toast("Pilot interest saved successfully."); setActiveAction(null); }, onError: () => toast("Could not save the pilot interest. Please try again.") }); }}><p>Tell us where you want to test the response loop. This demo keeps the interaction local and does not submit data to a live service.</p><label>Name<input name="name" required placeholder="Your name" /></label><label>District or organisation<input name="organisation" required placeholder="e.g. District health office" /></label><label>Email<input name="email" required type="email" placeholder="you@example.org" /></label><button className="btn btn-orange" type="submit" disabled={pilotMutation.isPending}>{pilotMutation.isPending ? "Saving…" : "Send pilot interest"} <ArrowUpRight size={16} /></button></form> : activeAction === "Drill toolkit" ? <div className="toolkit"><p>Select a role to preview the checklist that would be used in a district drill.</p><div className="toolkit-tabs">{["Community volunteer", "School coordinator", "Health centre"].map((role) => <button key={role} className={drillRole === role ? "active" : ""} onClick={() => setDrillRole(role)}>{role}</button>)}</div><div className="toolkit-checks"><div><Check size={15} /> Confirm safe assembly point</div><div><Check size={15} /> Share offline route with team</div><div><Check size={15} /> Report one local change</div></div><button className="btn btn-orange" onClick={() => { toast(`${drillRole} checklist marked ready.`); setActiveAction(null); }}>Mark checklist ready <Check size={16} /></button></div> : <><p>{activeAction === "SOS sent" ? "SOS queued successfully. The production flow would capture GPS, queue an offline packet, and use SMS fallback when required." : activeAction === "Safe route" ? "The safe route preview highlights the nearest cached evacuation path and keeps the route available offline." : activeAction === "SOS flow" ? "Press and hold the SOS control for 1.2 seconds to queue an emergency signal." : "This CAEMS interaction is staged as a clickable SIH demo and ready to connect to a live service."}</p><button className="btn btn-orange" onClick={() => setActiveAction(null)}>Close demo <Check size={16} /></button></>}</div></div>}
    </div>
  );
}
