import { useState, useEffect } from "react";
import "./App.css";

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

// =========================================================
// MOCK OSINT & RISK ENGINE (FRONTEND ONLY - NO BACKEND)
// =========================================================

function mockCollectOSINT(data) {
  const username = (data.username || "").trim().replace(/^@/, "");
  const name = (data.name || "").trim();
  const email = (data.email || "").trim().toLowerCase();

  const evidence = [
    {
      type: "public_profile",
      title: "PUBLIC GITHUB PROFILE",
      description: "A public GitHub profile was successfully resolved.",
      strength: "HIGH"
    }
  ];

  if (name) {
    evidence.push({
      type: "display_name",
      title: "DISPLAY NAME EXPOSED",
      description: `Public profile exposes display name "${name}".`,
      value: name,
      strength: "MEDIUM"
    });
  }

  if (email) {
    evidence.push({
      type: "public_email",
      title: "PUBLIC EMAIL",
      description: "A public email address is associated with the profile.",
      value: email,
      strength: "HIGH"
    });
  }

  const identifierAnalysis = [
    {
      platform: "GitHub",
      identifier: username,
      status: "FOUND",
      visibility: "PUBLIC",
      confidence: "HIGH",
      evidence,
      reason: "Public profile resolved.",
      url: `https://github.com/${username}`
    }
  ];

  const osintFindings = evidence.map(item => ({
    platform: "GitHub",
    identifier: username,
    category: item.type,
    status: "FOUND",
    visibility: "PUBLIC",
    confidence: item.strength,
    url: `https://github.com/${username}`,
    finding: item.description,
    value: item.value || null
  }));

  return { identifierAnalysis, osintFindings };
}

function mockCalculateRisk(identifierAnalysis) {
  let score = 25;
  const observations = [];

  for (const entry of identifierAnalysis) {
    observations.push({
      source: entry.platform,
      type: "account_exists",
      title: `${entry.platform.toUpperCase()} ACCOUNT FOUND`,
      message: `A public ${entry.platform} account was confirmed for "${entry.identifier}".`,
      severity: "low",
      points: 5
    });

    for (const item of entry.evidence || []) {
      const points = item.strength === "HIGH" ? 15 : 10;
      score += points;
      observations.push({
        source: entry.platform,
        type: item.type,
        title: item.title,
        message: item.description,
        severity: points >= 15 ? "medium" : "low",
        points
      });
    }
  }

  score = Math.min(score, 100);
  let level = score >= 70 ? "CRITICAL" : score >= 45 ? "HIGH" : score >= 25 ? "MEDIUM" : "LOW";

  return { score, level, observations };
}

function mockGeneratePhishingSimulation(formData) {
  const username = (formData.username || "").trim().replace(/^@/, "");
  const email = (formData.email || "").trim();

  return {
    applicable: true,
    threat: "ACCOUNT DEACTIVATION / REACTIVATION SCAM",
    attackSurface: [`Your GitHub account "${username}" is publicly visible.`],
    email: {
      from: "GitHub Support <support@github-security.example>",
      to: email || `${username}@example.com`,
      subject: `Action required: Your GitHub account "${username}" has been deactivated`
    },
    simulation: {
      message: `Hello ${username},\n\nWe detected that your account has been inactive. Please reactivate it below:\n\n[ REACTIVATE ACCOUNT ]`
    },
    whyItWorks: [
      "The message uses the target's real username.",
      "Urgency creates pressure to act quickly."
    ],
    defenses: [
      "Do not click account-recovery links inside unexpected emails.",
      "Open platform websites directly through your browser."
    ]
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
// CASE FILE COMPONENT
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

    // Simulate 800ms loading delay without making external network calls
    await new Promise(resolve => setTimeout(resolve, 800));

    const username = formData.username.trim().replace(/^@/, "");

    let result;

    // Phase 2 Special CTF Target Check (Pure Client-Side)
    if (username.toLowerCase() === "valkyrie_247") {
      result = {
        score: 95,
        level: "CRITICAL",
        observations: [
          {
            source: "GitHub",
            type: "exposed_key_artifact",
            title: "EXPOSED SYSTEM KEY ARTIFACT DETECTED",
            message: "Private key payload located in git repository artifact (/gitignore/privatekey). Inspect metadata headers.",
            severity: "high",
            points: 50
          }
        ],
        osintFindings: [
          {
            platform: "GitHub",
            identifier: "Valkyrie_247",
            category: "public_profile",
            status: "FOUND",
            visibility: "PUBLIC",
            confidence: "HIGH",
            url: "https://github.com/Valkyrie_247",
            finding: "Target profile confirmed active.",
            value: "Valkyrie_247"
          }
        ],
        identifierAnalysis: [
          {
            platform: "GitHub",
            identifier: "Valkyrie_247",
            status: "FOUND",
            visibility: "PUBLIC",
            confidence: "HIGH",
            evidence: [],
            reason: "Target handle matched CTF dossier.",
            url: "https://github.com/Valkyrie_247"
          }
        ],
        correlations: [],
        uncertainties: [],
        phishingSimulation: {
          applicable: true,
          threat: "TARGET DOSSIER UNLOCKED",
          attackSurface: ["Target artifact located at /gitignore/privatekey"],
          email: {
            from: "GitHub Security <notifications@github.com>",
            to: formData.email || "valkyrie@phantom.local",
            subject: 'Security notification for account "Valkyrie_247"'
          }
        }
      };
    } else {
      // Standard local OSINT simulation
      const { osintFindings, identifierAnalysis } = mockCollectOSINT(formData);
      const risk = mockCalculateRisk(identifierAnalysis);
      const phishingSimulation = mockGeneratePhishingSimulation(formData);

      result = {
        ...risk,
        osintFindings,
        identifierAnalysis,
        correlations: [],
        uncertainties: [],
        phishingSimulation
      };
    }

    setTarget(formData);
    setRisk(result);
    setPage("report");
    setLoading(false);
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
        placeholder="Valkyrie_247"
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

function RiskReport({ risk }) {
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

  // Sync window state on interval to catch modifications (Phase 1 CTF)
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

  // Route: Main Home View
  return (
    <div className="app">
      <div className="background"></div>
      <Navbar setPage={setPage} />
      <Hero />
      <main className="dashboard">
        <CaseFile setRisk={setRisk} setPage={setPage} setTarget={setTarget} />
        <RiskReport risk={risk} />
      </main>
      <Footer />
    </div>
  );
}