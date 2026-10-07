import { useState, useEffect } from "react";
import "./App.css";
import { SpeedInsights } from "@vercel/speed-insights/react"

// =========================================================
// CHALLENGE 1 INITIALIZATION (phantom01)
// =========================================================
if (typeof window !== "undefined" && !window.__INITIAL_STATE__) {
  window.__INITIAL_STATE__ = {
    user: {
      username: "Guest_User",
      role: "user",
      isLoggedIn: true
    }
  };
}

// =========================
// NAVBAR
// =========================

function Navbar({ setPage }) {
  return (
    <header>
      <div className="brand" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
        <h2>CIPHANTOM</h2>
        <p>OSINT CONSOLE</p>
      </div>

      <div className="navInfo">
        <span className="session">● SESSION ACTIVE</span>
      </div>
    </header>
  );
}

// =========================
// HERO
// =========================

function Hero() {
  return (
    <section className="hero">
      <p className="heroTag">CASE #4769 · DIGITAL FOOTPRINT AUDIT</p>
      <h1>
        Welcome, <span className="danger">Stalker.</span>
      </h1>
      <h2>
        I'm <span className="green">Ciphantom</span>
        <span className="cursor">_</span>
      </h2>
      <p className="description">
        A ghost hiding in your digital footprints.
        <br />
        Give me a handle and I'll show you what a stranger could piece together about you.
      </p>
    </section>
  );
}

// =========================
// ADMIN PANEL (CHALLENGE 1 TARGET)
// =========================

function AdminPanel({ setPage }) {
  return (
    <div className="simulationPage">
      <button className="backButton" onClick={() => setPage("home")}>
        ← BACK TO CONSOLE
      </button>

      <div className="simulationTitle">
        <p>RESTRICTED ACCESS · SYSTEM LOGS</p>
        <h1>Welcome Valkyrie_247</h1>
        <div className="simulationWarning">⚠ ELEVATED PRIVILEGES DETECTED</div>
      </div>

      <div className="panel" style={{ marginTop: "20px" }}>
        <h3>FLAG </h3>
        <p style={{ marginTop: "10px", color: "#888" }}>
          Target public repository acquired:
        </p>
        <code style={{ display: "block", margin: "15px 0", padding: "10px", background: "#111", color: "#00ff66" }}>
          $~WelcL0mE V@lkyrie_247
        </code>
      </div>
    </div>
  );
}

// =========================
// CASE FILE
// =========================

function CaseFile({ setRisk, setPage, setTarget }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    profileUrl: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function validateUsername(username) {
    const value = username.trim().replace(/^@/, "");

    if (!value) return "Username / handle is required";
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) return "Handle contains invalid characters";
    if (value.length < 2 || value.length > 50) return "Handle must be between 2 and 50 characters";

    return "";
  }

  function validateEmail(email) {
    const value = email.trim();
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return "";
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleInvestigation() {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Backend returned an error");

      const result = await response.json();
      setTarget(formData);
      setRisk(result);
      setPage("report");
    } catch (error) {
      console.error("Investigation failed:", error);
      setErrors({ backend: "Could not connect to Ciphantom backend." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <div className="panelHeader">
        <h3>CASE FILE</h3>
        <span>#4769</span>
      </div>

      <label>Name</label>
      <input
        name="name"
        placeholder="Jane Doe"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <p className="inputError">{errors.name}</p>}

      <label>Username / Handle</label>
      <input
        name="username"
        placeholder="j.doe_"
        value={formData.username}
        onChange={handleChange}
      />
      {errors.username && <p className="inputError">{errors.username}</p>}

      <label>Email</label>
      <input
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <p className="inputError">{errors.email}</p>}

      <label>Profile URL</label>
      <input
        name="profileUrl"
        placeholder="optional"
        value={formData.profileUrl}
        onChange={handleChange}
      />

      {errors.backend && <p className="inputError">{errors.backend}</p>}

      <button
        className="investigateButton"
        onClick={handleInvestigation}
        disabled={loading}
      >
        {loading ? "Investigating..." : "Begin Investigation"}
      </button>
    </div>
  );
}

// =========================
// OBSERVATION
// =========================

function Observation({ observation }) {
  return (
    <div className="observations">
      <div className="findingHeader">
        <span>{observation.title}</span>
        {observation.points !== undefined && <small>+{observation.points}</small>}
      </div>
    </div>
  );
}

// =========================
// RECOMMENDATIONS
// =========================

function Recommendations() {
  return (
    <div className="findings">
      <h4>RECOMMENDED ACTIONS</h4>
      <div className="recommendationList">
        <div>
          <span>01</span>
          <p>Review personal information exposed through public profiles.</p>
        </div>
        <div>
          <span>02</span>
          <p>Avoid reusing the same identity across unrelated platforms.</p>
        </div>
        <div>
          <span>03</span>
          <p>Remove unnecessary personal information from publicly accessible profiles.</p>
        </div>
        <div>
          <span>04</span>
          <p>Treat unexpected messages containing personal information with caution.</p>
        </div>
      </div>
    </div>
  );
}

// =========================
// RISK REPORT
// =========================

function RiskReport({ risk, setPage }) {
  if (!risk) {
    return (
      <div className="panel riskPanel">
        <div className="panelHeader">
          <h3>⚠ RISK REPORT</h3>
        </div>
        <p className="reportText">
          Run an investigation to generate an exposure score and determine what information
          could be pieced together about the target.
        </p>
        <div className="riskTags">
          <span>✓ VERIFIED PUBLIC INFO</span>
          <span>⚠ HIGH EXPOSURE</span>
          <span>◎ RELATIONSHIP / LINK</span>
          <span>○ NEEDS ATTENTION</span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel riskPanel">
      <div className="panelHeader">
        <h3>⚠ RISK REPORT</h3>
        <span>CASE #4769</span>
      </div>

      <div className="scoreSection">
        <div>
          <p>EXPOSURE SCORE</p>
          <strong>
            {risk.score}
            <small>/100</small>
          </strong>
        </div>
        <span className={`riskLevel ${risk.level}`}>{risk.level}</span>
      </div>

      <div className="findings">
        <h4>KEY OBSERVATIONS</h4>
        <div className="observationList">
          {risk.observations?.length > 0 ? (
            risk.observations.map((observation, index) => (
              <Observation observation={observation} key={index} />
            ))
          ) : (
            <div className="observations">
              <div className="findingHeader">
                <span>NO CONFIRMED EXPOSURE</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Recommendations />

      {risk.phishingSimulation?.applicable && (
        <div className="simulationPrompt">
          <div>
            <h4>SOCIAL ENGINEERING SIMULATION</h4>
            <p>
              See how the information discovered during this investigation could be combined
              into a convincing social-engineering message.
            </p>
          </div>
          <button
            className="simulationButton"
            onClick={() => setPage("simulation")}
          >
            VIEW SIMULATED ATTACK →
          </button>
        </div>
      )}

      {risk.uncertainties?.length > 0 && (
        <div className="uncertaintyBox">
          <h4>UNCERTAIN SOURCES</h4>
          {risk.uncertainties.map((uncertainty, index) => (
            <p key={index}>○ {uncertainty}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================
// FOOTER
// =========================

function Footer() {
  return (
    <footer>
      DISCLAIMER • For personal digital-privacy awareness only.
    </footer>
  );
}

// =========================
// MAIN APP COMPONENT
// =========================

export default function App() {
  const [risk, setRisk] = useState(null);
  const [target, setTarget] = useState(null);
  const [page, setPage] = useState("home");
  const [userRole, setUserRole] = useState(window.__INITIAL_STATE__?.user?.role || "user");

  // Sync window state on interval to catch modifications
  useEffect(() => {
    const interval = setInterval(() => {
      const currentRole = window.__INITIAL_STATE__?.user?.role;
      if (currentRole && currentRole !== userRole) {
        setUserRole(currentRole);
        if (currentRole === "admin") {
          setPage("admin");
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userRole]);

  // Route: Admin View
  if (page === "admin" || userRole === "admin") {
    return (
      <div className="app">
        <div className="background"></div>
        <Navbar setPage={setPage} />
        <AdminPanel setPage={setPage} />
        <Footer />
      </div>
    );
  }

  // Route: Phishing Simulation
  if (page === "simulation") {
    return (
      <div className="app">
        <div className="background"></div>
        <Navbar setPage={setPage} />
        {/* SimulationPage logic */}
        <Footer />
      </div>
    );
  }

  // Route: Main Home View
  return (
    <div className="app">
      <div className="background"></div>
      <Navbar setPage={setPage} />
      <Hero />
      <main className="dashboard">
        <CaseFile setRisk={setRisk} setPage={setPage} setTarget={setTarget} />
        <RiskReport risk={risk} setPage={setPage} />
      </main>
      <Footer />
    </div>
  );
}