// Monsoon Ledger reminder: this page uses an editorial field-manual layout, deep ink surfaces, monsoon teal routes, and safety orange only for risk/action.
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Bell, Check, ChevronRight, CloudRain, Crosshair, Database, Flame, Globe2, HeartPulse, Menu, Radio, Route, ShieldCheck, Signal, Siren, Smartphone, Users, X } from "lucide-react";

const heroMap = "/manus-storage/caems-hero-map_75937bf5.jpg";
const satelliteRisk = "/manus-storage/caems-satellite-risk_228fbb9d.jpg";
const communityDrill = "/manus-storage/caems-community-drill_0a0ed708.jpg";
const mark = "/manus-storage/caems-mark_3ad914e1.png";

const notifySoon = (label: string) => toast(`${label} is part of the next CAEMS pilot build.`);

function SectionLabel({ index, children }: { index: string; children: string }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"citizen" | "authority">("citizen");

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CAEMS home">
          <img src={mark} alt="" className="brand-mark" />
          <span><b>CAEMS</b><em>Community-AI / Emergency Management</em></span>
        </a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#system" onClick={() => setMenuOpen(false)}>The system</a>
          <a href="#response" onClick={() => setMenuOpen(false)}>Response loop</a>
          <a href="#stack" onClick={() => setMenuOpen(false)}>Build notes</a>
          <button className="nav-cta" onClick={() => notifySoon("Pilot briefing")}>Request pilot <ArrowUpRight size={15} /></button>
        </nav>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-map" style={{ backgroundImage: `url(${heroMap})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow"><span className="live-dot" /> SIH 2025 / HEALTH EMERGENCY TRACK</div>
            <h1>When the warning lands,<br /><i>the response starts.</i></h1>
            <p className="hero-copy">CAEMS connects localized risk intelligence with the people who need to act—before, during, and after an emergency. Built for districts where every minute, megabyte, and volunteer counts.</p>
            <div className="hero-actions">
              <button className="btn btn-orange" onClick={() => document.querySelector("#system")?.scrollIntoView({ behavior: "smooth" })}>See how it works <ArrowUpRight size={17} /></button>
              <button className="text-link" onClick={() => notifySoon("Live demo")}>Explore the command view <ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="hero-stamp"><span>FIELD NOTE 01</span><strong>Warning →<br />coordinated action</strong><small>Prepared for low-bandwidth districts</small></div>
          <div className="hero-coordinates">20°35'12"N &nbsp; 78°57'31"E<br /><span>MONSOON WATCH / ACTIVE</span></div>
        </section>

        <section className="intro-strip dossier-light">
          <div className="intro-kicker">THE GAP <small className="coord-note">FIELD NOTE / 00—A</small></div>
          <div className="intro-body"><h2>Most systems stop at the alert.<br /><em>CAEMS stays for the work after.</em></h2><p>Official warnings are essential. But a district also needs verified ground reports, clear task ownership, rescue coordination, and a record of what changed. CAEMS is the operational layer between a notification and a safer recovery.</p></div>
        </section>

        <section className="section" id="system">
          <SectionLabel index="01" children="A connected emergency system" />
          <div className="section-heading"><h2>One platform.<br /><em>Three moments that matter.</em></h2><p>From early signals to impact analytics, every layer is designed around the realities of community response: shared phones, patchy networks, multiple languages, and limited infrastructure.</p></div>
          <div className="system-grid">
            <article className="system-card card-dark"><div className="card-index">01 / PREPARE</div><div className="card-icon teal"><CloudRain /></div><h3>See risk earlier</h3><p>Satellite imagery, weather feeds, hazard records, and community reports combine into explainable neighborhood-level risk maps.</p><div className="mini-map"><div className="mini-route" /><span className="mini-pin pin-a" /><span className="mini-pin pin-b" /><span className="map-tag">FLOOD INDEX / 0.72</span></div><span className="card-footer">SATELLITE + OPENWEATHER <ArrowUpRight size={15} /></span></article>
            <article className="system-card card-sand"><div className="card-index">02 / RESPOND</div><div className="card-icon orange"><Siren /></div><h3>Move help with context</h3><p>Authorities see live incidents, assign volunteers, route resources, and keep an auditable view of what is verified.</p><div className="task-stack"><div><span className="status orange-dot" /> SOS-184 <b>Rescue team assigned</b><small>Ward 08 · 2 min ago</small></div><div><span className="status teal-dot" /> R-029 <b>Medical kit en route</b><small>PHC North · 6 min ago</small></div></div><span className="card-footer">COMMAND DASHBOARD <ArrowUpRight size={15} /></span></article>
            <article className="system-card card-teal"><div className="card-index">03 / RECOVER</div><div className="card-icon sand"><Database /></div><h3>Learn from every event</h3><p>Damage reports, relief inventory, drills, and feedback close the loop—so the next response starts stronger.</p><div className="recovery-stat"><strong>+20%</strong><span>target improvement<br />over baseline maps</span></div><span className="card-footer">IMPACT ANALYTICS <ArrowUpRight size={15} /></span></article>
          </div>
        </section>

        <section className="response-section" id="response">
          <div className="response-visual"><img src={satelliteRisk} alt="Topographic risk map texture" /><div className="visual-caption"><span>RISK LAYER / 04</span><strong>Explainable signals.<br />Actionable routes.</strong></div></div>
          <div className="response-copy"><SectionLabel index="02" children="Designed for the last mile" /><h2>Built to keep working<br /><em>when networks don’t.</em></h2><p>CAEMS treats connectivity as a design constraint, not an edge case. The app caches what people need before they need it, then falls back to the simplest channel available.</p><div className="capability-list"><div><span><Smartphone /></span><p><b>Offline-first citizen app</b>Pre-downloaded evacuation maps, checklists, compressed damage reports, and one-tap GPS SOS.</p></div><div><span><Radio /></span><p><b>Push, pull, SMS fallback</b>Alerts reach registered households through Firebase notifications, SMS, and future IVR pathways.</p></div><div><span><Users /></span><p><b>Community-ready UX</b>Multilingual flows, role-based drill templates, and simple guides for schools, health centers, and volunteers.</p></div></div><button className="text-link teal-link" onClick={() => notifySoon("Citizen app preview")}>Preview the citizen journey <ChevronRight size={16} /></button></div>
        </section>

        <section className="dashboard-section dossier-light">
          <div className="dossier-trace trace-top"><span className="trace-point" /></div><div className="dashboard-head"><div><SectionLabel index="03" children="Two views. One operating picture." /><h2>Right information,<br /><em>right person.</em></h2></div><div className="mode-switch"><button className={activeMode === "citizen" ? "active" : ""} onClick={() => setActiveMode("citizen")}><Smartphone size={15} /> Citizen app</button><button className={activeMode === "authority" ? "active" : ""} onClick={() => setActiveMode("authority")}><Globe2 size={15} /> Authority view</button></div></div>
          {activeMode === "citizen" ? <div className="phone-evidence"><div className="evidence-note note-left"><span>DEVICE / CITIZEN 01</span><b>Offline ready</b><small>Last map sync<br />08:39 · Ward 08</small></div><div className="phone-demo"><div className="phone-notch" /><div className="phone-top"><span>CAEMS</span><Signal size={14} /></div><div className="phone-alert"><div className="alert-top"><span className="live-dot" /> LIVE ALERT <small>08:42</small></div><h3>Heavy rainfall advisory</h3><p>Ward 08–12 · Moderate flood risk predicted in next 3 hours.</p><button onClick={() => notifySoon("Safe route")}>View safe route <ArrowUpRight size={14} /></button></div><div className="phone-section-title">YOUR READINESS</div><div className="phone-check"><Check /> <span>Offline map downloaded</span><b>DONE</b></div><div className="phone-check"><Check /> <span>Household checklist</span><b>6 / 8</b></div><button className="sos-button" onClick={() => notifySoon("SOS flow")}> <Crosshair size={17} /> HOLD FOR SOS</button></div></div> : <div className="authority-demo"><div className="dash-top"><span><span className="live-dot" /> DISTRICT COMMAND / LIVE</span><small>Last sync 08:42:18</small></div><div className="dash-grid"><div className="dash-map"><div className="map-grid-lines" /><span className="dash-route" /><span className="dash-pin dp1" /><span className="dash-pin dp2" /><span className="dash-pin dp3" /><div className="map-legend"><span><i className="orange-bg" /> active incident</span><span><i className="teal-bg" /> safe route</span></div></div><div className="dash-side"><div className="dash-stat"><small>OPEN SOS</small><strong>18</strong><span className="up">+4 today</span></div><div className="dash-stat"><small>VOLUNTEERS ACTIVE</small><strong>64</strong><span>of 82 registered</span></div><div className="dash-stat"><small>RELIEF INVENTORY</small><strong>76%</strong><span className="warn">2 items low</span></div></div></div></div>}
        </section>

        <section className="metrics-section dossier-teal"><SectionLabel index="04" children="Pilot targets" /><div className="metrics-grid"><Metric value="80%" label="alert reach" detail="registered users within 2 min" /><Metric value="−30%" label="coordination time" detail="task assignment to action" /><Metric value="+20%" label="risk accuracy" detail="over baseline heuristic maps" /><Metric value="1 loop" label="community feedback" detail="drills → data → readiness" /></div></section>

        <section className="engage-section"><div className="engage-copy"><SectionLabel index="05" children="Resilience is practiced" /><h2>Preparedness is not a push notification.<br /><em>It is a shared habit.</em></h2><p>CAEMS gives communities a simple rhythm: run the drill, check the route, report what changed, and make the next plan more local than the last one.</p><button className="btn btn-orange" onClick={() => notifySoon("Drill toolkit")}>Open the drill toolkit <ArrowUpRight size={17} /></button></div><div className="engage-image"><img src={communityDrill} alt="Community volunteers reviewing an evacuation map" /><div className="image-note">FIELD NOTE 05<br /><strong>Training turns<br />systems into trust.</strong></div></div></section>

        <section className="stack-section dossier-light" id="stack"><div className="dossier-stamp">SYSTEM / 06<br /><strong>FIELD-READY</strong></div><SectionLabel index="06" children="Build notes" /><div className="stack-layout"><div><h2>Modern under the hood.<br /><em>Practical in the field.</em></h2><p>CAEMS is intentionally modular: reliable services underneath, low-friction experiences on top. The stack is designed for rapid deployment and iteration with district partners.</p></div><div className="stack-table"><div><span>Mobile</span><b>React Native + TypeScript</b></div><div><span>Dashboard</span><b>React.js + TypeScript</b></div><div><span>Backend / API</span><b>Python + FastAPI</b></div><div><span>Live updates</span><b>WebSockets</b></div><div><span>Notifications</span><b>Firebase Cloud Messaging</b></div><div><span>Data signals</span><b>OpenWeather + Sentinel / Landsat</b></div></div></div></section>

        <section className="difference-section dossier-light"><div className="dossier-trace trace-bottom"><span className="trace-point" /></div><div className="difference-mark">CAEMS<br /><span>≠</span><br />SACHET</div><div><SectionLabel index="07" children="Why CAEMS" /><h2>Not another alert inbox.<br /><em>An action layer.</em></h2><p>SACHET delivers authorized, geo-targeted disaster warnings across official channels and multiple Indian languages. CAEMS is designed for what happens next: verified ground reports, SOS management, rescue team assignment, relief tracking, and local feedback.</p><div className="difference-points"><span><Check size={15} /> Warning distribution</span><span><Check size={15} /> Ground verification</span><span><Check size={15} /> Task coordination</span><span><Check size={15} /> Recovery analytics</span></div></div></section>

        <section className="final-cta"><div className="final-grid" /><div className="eyebrow"><span className="live-dot" /> COMMUNITY-AI / EMERGENCY MANAGEMENT</div><h2>Make the next<br /><i>minute count.</i></h2><p>CAEMS is a proposal for a more connected kind of readiness—one that starts with a signal and ends with people moving together.</p><button className="btn btn-orange" onClick={() => notifySoon("CAEMS pilot briefing")}>Talk to the team <ArrowUpRight size={17} /></button></section>
      </main>
      <footer><a className="brand" href="#top"><img src={mark} alt="" className="brand-mark" /><span><b>CAEMS</b><em>SIH / CONCEPT PROPOSAL</em></span></a><span>Community-AI Emergency Management System</span><span>Built for resilient districts.</span></footer>
    </div>
  );
}
