import { useState } from "react";
import "./App.css";

// =========================
// NAVBAR
// =========================

function Navbar() {
  return (
    <header>
      <div className="brand">
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

      <p className="heroTag">
        CASE #4769 · DIGITAL FOOTPRINT AUDIT
      </p>

      <h1>
        Welcome,
        <span className="danger"> Stalker.</span>
      </h1>

      <h2>
        I'm
        <span className="green"> Ciphantom</span>
        <span className="cursor">_</span>
      </h2>

      <p className="description">
        A ghost hiding in your digital footprints.
        <br />
        Give me a handle and I'll show you what
        a stranger could piece together about you.
      </p>

    </section>
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

    if (!value) {
      return "Username / handle is required";
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
      return "Handle contains invalid characters";
    }

    if (value.length < 2 || value.length > 50) {
      return "Handle must be between 2 and 50 characters";
    }

    return "";
  }

  function validateEmail(email) {

    const value = email.trim();

    if (!value) {
      return "";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }

    return "";
  }

  function validateForm() {

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const usernameError =
      validateUsername(formData.username);

    if (usernameError) {
      newErrors.username = usernameError;
    }

    const emailError =
      validateEmail(formData.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleInvestigation() {

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/investigate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Backend returned an error");
      }

      const result = await response.json();

      console.log("Ciphantom result:", result);

      // Keep the original input for the simulation page.
      setTarget(formData);

      setRisk(result);

      setPage("report");

    } catch (error) {

      console.error("Investigation failed:", error);

      setErrors({
        backend:
          "Could not connect to Ciphantom backend."
      });

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

      {errors.name && (
        <p className="inputError">
          {errors.name}
        </p>
      )}

      <label>Username / Handle</label>

      <input
        name="username"
        placeholder="j.doe_"
        value={formData.username}
        onChange={handleChange}
      />

      {errors.username && (
        <p className="inputError">
          {errors.username}
        </p>
      )}

      <label>Email</label>

      <input
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
      />

      {errors.email && (
        <p className="inputError">
          {errors.email}
        </p>
      )}

      <label>Profile URL</label>

      <input
        name="profileUrl"
        placeholder="optional"
        value={formData.profileUrl}
        onChange={handleChange}
      />

      {errors.backend && (
        <p className="inputError">
          {errors.backend}
        </p>
      )}

      <button
        className="investigateButton"
        onClick={handleInvestigation}
        disabled={loading}
      >
        {loading
          ? "Investigating..."
          : "Begin Investigation"}
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

        <span>
          {observation.title}
        </span>

        {observation.points !== undefined && (
          <small>
            +{observation.points}
          </small>
        )}

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
          <p>
            Review personal information exposed through
            public profiles.
          </p>
        </div>

        <div>
          <span>02</span>
          <p>
            Avoid reusing the same identity across
            unrelated platforms.
          </p>
        </div>

        <div>
          <span>03</span>
          <p>
            Remove unnecessary personal information
            from publicly accessible profiles.
          </p>
        </div>

        <div>
          <span>04</span>
          <p>
            Treat unexpected messages containing
            personal information with caution.
          </p>
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
          Run an investigation to generate an exposure
          score and determine what information could be
          pieced together about the target.
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

      {/* SCORE */}

      <div className="scoreSection">

        <div>

          <p>EXPOSURE SCORE</p>

          <strong>
            {risk.score}
            <small>/100</small>
          </strong>

        </div>

        <span
          className={`riskLevel ${risk.level}`}
        >
          {risk.level}
        </span>

      </div>

      {/* OBSERVATIONS */}

      <div className="findings">

        <h4>KEY OBSERVATIONS</h4>

        <div className="observationList">

          {risk.observations?.length > 0 ? (

            risk.observations.map(
              (observation, index) => (

                <Observation
                  observation={observation}
                  key={index}
                />

              )
            )

          ) : (

            <div className="observations">

              <div className="findingHeader">

                <span>
                  NO CONFIRMED EXPOSURE
                </span>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* RECOMMENDATIONS */}

      <Recommendations />

      {/* SIMULATION */}

      {risk.phishingSimulation?.applicable && (

        <div className="simulationPrompt">

          <div>

            <h4>
              SOCIAL ENGINEERING SIMULATION
            </h4>

            <p>
              See how the information discovered during
              this investigation could be combined into
              a convincing social-engineering message.
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

      {/* UNCERTAINTIES */}

      {risk.uncertainties?.length > 0 && (

        <div className="uncertaintyBox">

          <h4>UNCERTAIN SOURCES</h4>

          {risk.uncertainties.map(
            (uncertainty, index) => (

              <p key={index}>
                ○ {uncertainty}
              </p>

            )
          )}

        </div>

      )}

    </div>
  );
}

// =========================
// EMAIL DATA
// =========================

const emailTemplates = [

  {
    subject: "Security verification required",
    sender: "Account Security",
    message: [
      "Hello,",
      "We detected an unusual sign-in attempt associated with your account.",
      "To keep your account protected, please verify your recent activity through your organisation's normal security process.",
      "If you did not attempt to sign in, contact your administrator through an independently verified channel.",
      "Security Operations"
    ]
  },

  {
    subject: "Action required: account review",
    sender: "Support Team",
    message: [
      "Hello,",
      "Your account has been selected for a routine security review.",
      "Some account information needs to be confirmed before the review can be completed.",
      "Please use the official support portal rather than responding to unexpected messages with personal information.",
      "Support Team"
    ]
  },

  {
    subject: "Important notification regarding your account",
    sender: "Account Services",
    message: [
      "Hello,",
      "We are contacting you regarding a recent change associated with your account.",
      "Before taking any action, verify that this message came from a legitimate source and access the service through its official website.",
      "Never provide passwords, verification codes, or sensitive information by email.",
      "Account Services"
    ]
  }

];

// =========================
// EMAIL HEADER
// =========================

function EmailHeader({ target, email }) {

  return (

    <div className="emailHeader">

      <div className="emailRow">

        <span>From</span>

        <strong>
          {email.sender}
        </strong>

      </div>

      <div className="emailRow">

        <span>To</span>

        <strong>
          {target?.email || "No email supplied"}
        </strong>

      </div>

      <div className="emailRow">

        <span>Subject</span>

        <strong>
          {email.subject}
        </strong>

      </div>

    </div>
  );
}

// =========================
// ATTACK SIMULATION
// =========================

// =========================
// ATTACK SIMULATION
// =========================

function SimulationPage({ risk, setPage }) {
  const simulation = risk?.phishingSimulation;

  if (!simulation?.applicable) {
    return (
      <div className="simulationPage">

        <button
          className="backButton"
          onClick={() => setPage("report")}
        >
          ← BACK TO RISK REPORT
        </button>

        <div className="simulationNotice">
          No social-engineering simulation is available
          for the current investigation.
        </div>

      </div>
    );
  }

  /*
   * EVERYTHING BELOW COMES FROM THE BACKEND
   * No hardcoded "user" / fake target fallback.
   */

  const attackSurface =
    simulation.attackSurface || [];

  const email =
    simulation.email || {};

  const suppliedUsername =
    risk?.identifierAnalysis?.find(
      item => item.platform === "GitHub" &&
             item.status === "FOUND"
    )?.identifier || "";

  const suppliedEmail =
    email.to || "";

  /*
   * Get the actual GitHub display name from
   * the OSINT evidence returned by the backend.
   */

  const displayName =
    risk?.osintFindings?.find(
      item =>
        item.platform === "GitHub" &&
        item.category === "display_name"
    )?.value || "";

  /*
   * Use the backend-generated email.
   * This means the subject, sender and recipient
   * all stay tied to the actual investigation.
   */

  const emailSubject =
    email.subject ||
    `Security notification for GitHub account "${suppliedUsername}"`;

  const emailSender =
    email.from ||
    "GitHub Security <notifications@github.com>";

  /*
   * Dynamic danger explanation based on
   * information actually discovered.
   */

  const dangerExplanation = [

    `This is a phishing simulation. The attacker is pretending to be GitHub so that the recipient is more likely to trust the message.`,

    suppliedUsername
      ? `The message uses the real username "${suppliedUsername}" discovered during the investigation. Familiar information can make a fake message feel legitimate.`
      : `The message uses information discovered during the investigation to make the communication appear more believable.`,

    displayName
      ? `The investigation also found the public display name "${displayName}", which could be used to make the message feel more personally targeted.`
      : null,

    `The dangerous part is the link. A site reached through the message could redirect the recipient to a fake website that looks like the real service.`,

    `If the victim enters their password or other information on that fake page, the attacker could receive it. In simple terms, the attacker is trying to trick the person into giving away access rather than breaking into the account directly.`,

    `This demonstrates why several small pieces of public information can become useful when combined into a believable social-engineering message.`
  ].filter(Boolean);


  /*
   * Information actually used in the simulation.
   */

  const informationUsed =
    attackSurface.length > 0
      ? attackSurface
      : [
          "No specific public information was available for this simulation."
        ];


  /*
   * Dynamic precautions.
   * These are intentionally selected differently
   * for each generated simulation.
   */

  const defensePool = [

    "Open GitHub directly through your browser instead of using a link in an unexpected email.",

    "Check the actual destination of a link before opening it.",

    "Never enter your password on a page reached through an unexpected message.",

    "Enable two-factor authentication to add another layer of protection.",

    "Prefer passkeys or security keys where available because they are more resistant to phishing.",

    "If a message creates urgency, pause and verify the request independently.",

    "Check your GitHub security and notification settings directly.",

    "Do not assume an email is legitimate just because it contains your real username.",

    "Check the sender's actual email domain rather than trusting the displayed sender name.",

    "Report suspicious messages instead of interacting with their links."
  ];

  /*
   * Deterministically choose 4 precautions based
   * on this investigation rather than using Math.random()
   * during every render.
   */

  const defenseStart =
    suppliedUsername.length % defensePool.length;

  const defenses = [
    ...defensePool.slice(defenseStart),
    ...defensePool.slice(0, defenseStart)
  ].slice(0, 4);


  return (

    <div className="simulationPage">

      {/* BACK */}

      <button
        className="backButton"
        onClick={() => setPage("report")}
      >
        ← BACK TO RISK REPORT
      </button>


      {/* TITLE */}

      <div className="simulationTitle">

        <p>
          CASE #4769 · SOCIAL ENGINEERING ANALYSIS
        </p>

        <h1>
          Attack Simulation
        </h1>

        <div className="simulationWarning">
          ⚠ EDUCATIONAL SIMULATION · THIS EMAIL WAS NOT SENT
        </div>

      </div>


      {/* =========================
          GMAIL STYLE EMAIL
      ========================= */}

      <div className="gmailWindow">

        {/* TOP BAR */}

        <div className="gmailTopBar">

          <div className="gmailBrand">
            <span className="gmailLogo">M</span>
            <span>Mail</span>
          </div>

          <div className="gmailControls">
            <span>□</span>
            <span>⋮</span>
          </div>

        </div>


        {/* EMAIL */}

        <div className="gmailContent">

          {/* SUBJECT */}

          <h2 className="gmailSubject">
            {emailSubject}
          </h2>


          {/* SENDER */}

          <div className="gmailSender">

            <div className="senderAvatar">
              G
            </div>

            <div className="senderInfo">

              <div className="senderName">
                GitHub Security
              </div>

              <div className="senderAddress">
                &lt;notifications@github.com&gt;
              </div>

            </div>

            <div className="emailTime">
              now
            </div>

          </div>


          {/* RECIPIENT */}

          <div className="gmailRecipient">

            <span>to</span>

            <strong>
              {suppliedEmail || "Recipient"}
            </strong>

            <span>⌄</span>

          </div>


          {/* BODY */}

          <div className="gmailBody">

            <p>
              Hi{" "}
              <strong>
                {suppliedUsername || "there"}
              </strong>,
            </p>


            <p>
              Your GitHub account has been flagged for
              a security review.
            </p>


            <p>
              We detected activity associated with your
              account that requires your attention.
              Please review the notification and confirm
              that your account activity is expected.
            </p>


            {/* ACCOUNT INFORMATION */}

            <div className="accountBox">

              <div>

                <span>
                  ACCOUNT
                </span>

                <strong>
                  {suppliedUsername || "Not available"}
                </strong>

              </div>


              <div>

                <span>
                  PROFILE
                </span>

                <strong>
                  github.com/{suppliedUsername || "account"}
                </strong>

              </div>


              {displayName && (

                <div>

                  <span>
                    PROFILE NAME
                  </span>

                  <strong>
                    {displayName}
                  </strong>

                </div>

              )}

            </div>


            <p>
              Please review your account status to make
              sure your access remains uninterrupted.
            </p>


            {/* SIMULATED LINK */}

            <button
              className="fakeEmailButton"
              onClick={(e) => e.preventDefault()}
            >
              REVIEW ACCOUNT STATUS
            </button>


            <p>
              If you did not expect this message, do not
              use the link above. Instead, open GitHub
              directly through your browser and check
              your account there.
            </p>


            <p className="emailSignature">
              GitHub Security
              <br />
              GitHub, Inc.
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          WHY DANGEROUS
      ========================= */}

      <div className="simulationSection">

        <div className="simulationCard dangerExplanation">

          <h3>
            WHY THIS COULD BE DANGEROUS
          </h3>

          {dangerExplanation.map(
            (paragraph, index) => (

              <p key={index}>
                {paragraph}
              </p>

            )
          )}

        </div>


        {/* =========================
            INFORMATION USED
        ========================= */}

        <div className="simulationCard">

          <h3>
            INFORMATION USED
          </h3>

          <ul>

            {informationUsed.map(
              (item, index) => (

                <li key={index}>
                  {item}
                </li>

              )
            )}

          </ul>

        </div>

      </div>


      {/* =========================
          DEFENSE
      ========================= */}

      <div className="defenseCard">

        <h3>
          HOW TO DEFEND
        </h3>

        <ul>

          {defenses.map(
            (defense, index) => (

              <li key={index}>
                {defense}
              </li>

            )
          )}

        </ul>

      </div>


      {/* =========================
          DISCLAIMER
      ========================= */}

      <div className="simulationDisclaimer">

        This message was generated by Ciphantom using
        information from the current investigation.
        It is a simulated example of social engineering
        and was not delivered to the target.

      </div>

    </div>
  );
}

// =========================
// FOOTER
// =========================

function Footer() {

  return (

    <footer>
      DISCLAIMER • For personal digital-privacy
      awareness only.
    </footer>

  );
}

// =========================
// APP
// =========================

export default function App() {

  const [risk, setRisk] = useState(null);

  const [target, setTarget] = useState(null);

  const [page, setPage] = useState("home");

  // =========================
  // SIMULATION PAGE
  // =========================

  if (page === "simulation") {

    return (

      <div className="app">

        <div className="background"></div>

        <Navbar />

        <SimulationPage
          risk={risk}
          target={target}
          setPage={setPage}
        />

        <Footer />

      </div>

    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (

    <div className="app">

      <div className="background"></div>

      <Navbar />

      <Hero />

      <main className="dashboard">

        <CaseFile
          setRisk={setRisk}
          setPage={setPage}
          setTarget={setTarget}
        />

        <RiskReport
          risk={risk}
          setPage={setPage}
        />

      </main>

      <Footer />

    </div>

  );
}