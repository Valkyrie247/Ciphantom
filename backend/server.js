const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Ciphantom backend is running"
  });
});

// =====================================================
// GITHUB CHECK
// =====================================================

async function checkGitHub(username, name, email) {

  const url = `https://github.com/${username}`;
  const apiUrl =
    `https://api.github.com/users/${encodeURIComponent(username)}`;

  try {

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Ciphantom-OSINT"
      }
    });

    // Account definitely does not exist
    if (response.status === 404) {

      return {
        platform: "GitHub",
        identifier: username,
        status: "NOT_FOUND",
        visibility: "UNKNOWN",
        confidence: "HIGH",
        evidence: [],
        reason: "GitHub API returned HTTP 404.",
        url
      };
    }

    // Something went wrong with the API
    if (!response.ok) {

      return {
        platform: "GitHub",
        identifier: username,
        status: "UNVERIFIED",
        visibility: "UNKNOWN",
        confidence: "LOW",
        evidence: [],
        reason:
          `GitHub API returned HTTP ${response.status}.`,
        url
      };
    }

    const profile = await response.json();

    const evidence = [];

    // -------------------------------------------------
    // PUBLIC PROFILE
    // -------------------------------------------------

    evidence.push({

      type: "public_profile",

      title: "PUBLIC GITHUB PROFILE",

      description:
        "A public GitHub profile was successfully resolved.",

      strength: "HIGH"

    });

    // -------------------------------------------------
    // DISPLAY NAME
    // -------------------------------------------------

    if (profile.name) {

      evidence.push({

        type: "display_name",

        title: "DISPLAY NAME EXPOSED",

        description:
          `GitHub publicly exposes the display name "${profile.name}".`,

        value: profile.name,

        strength: "MEDIUM"

      });

      // Compare supplied name with GitHub name

      if (name) {

        const suppliedParts =
          name
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        const githubParts =
          profile.name
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        const matchingParts =
          suppliedParts.filter(part =>
            githubParts.includes(part)
          );

        if (matchingParts.length > 0) {

          evidence.push({

            type: "name_correlation",

            title: "NAME CORRELATION",

            description:
              `The GitHub display name "${profile.name}" shares ${matchingParts.length} name component(s) with the supplied name "${name}".`,

            value: {
              supplied: name,
              observed: profile.name,
              matchingParts
            },

            strength:
              matchingParts.length >= 2
                ? "HIGH"
                : "MEDIUM"

          });

        }
      }
    }

    // -------------------------------------------------
    // PUBLIC EMAIL
    // -------------------------------------------------

    if (profile.email) {

      evidence.push({

        type: "public_email",

        title: "PUBLIC EMAIL",

        description:
          "A public email address is associated with the GitHub profile.",

        value: profile.email,

        strength: "HIGH"

      });

      // Compare supplied email with GitHub email

      if (
        email &&
        profile.email.toLowerCase() === email.toLowerCase()
      ) {

        evidence.push({

          type: "email_correlation",

          title: "EMAIL CORRELATION",

          description:
            "The publicly exposed GitHub email matches the supplied email.",

          value: profile.email,

          strength: "HIGH"

        });

      }
    }

    // -------------------------------------------------
    // BIO
    // -------------------------------------------------

    if (profile.bio) {

      evidence.push({

        type: "bio",

        title: "PUBLIC BIO",

        description:
          "The GitHub profile exposes a public biography.",

        value: profile.bio,

        strength: "MEDIUM"

      });

    }

    // -------------------------------------------------
    // LOCATION
    // -------------------------------------------------

    if (profile.location) {

      evidence.push({

        type: "location",

        title: "LOCATION EXPOSED",

        description:
          `GitHub publicly exposes the location "${profile.location}".`,

        value: profile.location,

        strength: "MEDIUM"

      });

    }

    // -------------------------------------------------
    // WEBSITE
    // -------------------------------------------------

    if (profile.blog) {

      evidence.push({

        type: "external_website",

        title: "EXTERNAL WEBSITE",

        description:
          "The GitHub profile contains a publicly visible external website.",

        value: profile.blog,

        strength: "MEDIUM"

      });

    }

    // -------------------------------------------------
    // PUBLIC REPOSITORIES
    // -------------------------------------------------

    if (
      typeof profile.public_repos === "number" &&
      profile.public_repos > 0
    ) {

      evidence.push({

        type: "public_repositories",

        title: "PUBLIC REPOSITORIES",

        description:
          `The account exposes ${profile.public_repos} public ${
            profile.public_repos === 1
              ? "repository"
              : "repositories"
          }.`,

        value: profile.public_repos,

        strength: "MEDIUM"

      });

    }

    // -------------------------------------------------
    // FOLLOWERS
    // -------------------------------------------------

    if (
      typeof profile.followers === "number" &&
      profile.followers > 0
    ) {

      evidence.push({

        type: "followers",

        title: "PUBLIC FOLLOWER COUNT",

        description:
          `The GitHub account publicly exposes ${profile.followers} follower(s).`,

        value: profile.followers,

        strength: "LOW"

      });

    }

    // -------------------------------------------------
    // FINAL GITHUB RESULT
    // -------------------------------------------------

    return {

      platform: "GitHub",

      identifier: username,

      status: "FOUND",

      visibility: "PUBLIC",

      confidence: "HIGH",

      evidence,

      reason:
        "GitHub public API successfully resolved the account.",

      url

    };

  } catch (error) {

    return {

      platform: "GitHub",

      identifier: username,

      status: "UNVERIFIED",

      visibility: "UNKNOWN",

      confidence: "LOW",

      evidence: [],

      reason: "GitHub request failed.",

      url

    };

  }
}

// =====================================================
// INSTAGRAM CHECK
// =====================================================

async function checkInstagram(username) {

  const url =
    `https://www.instagram.com/${encodeURIComponent(username)}/`;

  try {

    const response = await fetch(url, {

      method: "HEAD",

      redirect: "follow",

      headers: {
        "User-Agent": "Mozilla/5.0"
      }

    });

    // Instagram 404 can indicate that the
    // requested page does not exist.

    if (response.status === 404) {

      return {

        platform: "Instagram",

        identifier: username,

        status: "NOT_FOUND",

        visibility: "UNKNOWN",

        confidence: "MEDIUM",

        evidence: [],

        reason: "Instagram returned HTTP 404.",

        url

      };

    }

    // We deliberately do NOT pretend that HTTP 200
    // proves the account exists.

    return {

      platform: "Instagram",

      identifier: username,

      status: "UNVERIFIED",

      visibility: "UNKNOWN",

      confidence: "LOW",

      evidence: [],

      reason:
        "Instagram does not reliably expose account existence through unauthenticated HTTP requests.",

      url

    };

  } catch (error) {

    return {

      platform: "Instagram",

      identifier: username,

      status: "UNVERIFIED",

      visibility: "UNKNOWN",

      confidence: "LOW",

      evidence: [],

      reason: "Instagram request failed.",

      url

    };

  }
}

// =====================================================
// COLLECT OSINT
// =====================================================

async function collectOSINT(data) {

  const name =
    data.name?.trim() || "";

  const username =
    data.username
      ?.trim()
      .replace(/^@/, "") || "";

  const email =
    data.email
      ?.trim()
      .toLowerCase() || "";

  // Username is required for this version

  if (!username) {

    return {

      identifierAnalysis: [],

      osintFindings: []

    };

  }

  // Run both checks

  const results = await Promise.all([

    checkGitHub(
      username,
      name,
      email
    ),

    checkInstagram(username)

  ]);

  const identifierAnalysis =
    results;

  const osintFindings = [];

  // Convert evidence into findings

  for (const result of results) {

    if (result.status !== "FOUND") {
      continue;
    }

    for (const evidence of result.evidence) {

      osintFindings.push({

        platform: result.platform,

        identifier: result.identifier,

        category: evidence.type,

        status: "FOUND",

        visibility: result.visibility,

        confidence: evidence.strength,

        url: result.url,

        finding: evidence.description,

        value: evidence.value ?? null

      });

    }
  }

  return {

    identifierAnalysis,

    osintFindings

  };

}

// =====================================================
// CORRELATION
// =====================================================

function correlateIdentities(identifierAnalysis) {

  const found =
    identifierAnalysis.filter(
      entry => entry.status === "FOUND"
    );

  const correlations = [];

  // Compare confirmed accounts

  for (let i = 0; i < found.length; i++) {

    for (let j = i + 1; j < found.length; j++) {

      const accountA = found[i];
      const accountB = found[j];

      // Same username on two confirmed platforms

      if (
        accountA.identifier.toLowerCase() ===
        accountB.identifier.toLowerCase()
      ) {

        correlations.push({

          type: "username_reuse",

          accounts: [

            {
              platform: accountA.platform,
              identifier: accountA.identifier,
              url: accountA.url
            },

            {
              platform: accountB.platform,
              identifier: accountB.identifier,
              url: accountB.url
            }

          ],

          confidence: "MEDIUM",

          explanation:
            `The same identifier "${accountA.identifier}" was confirmed on ${accountA.platform} and ${accountB.platform}.`,

          evidence: [

            {

              type: "identical_username",

              value: accountA.identifier,

              strength: "MEDIUM"

            }

          ]

        });

      }

    }

  }

  return correlations;

}

// =====================================================
// RISK CALCULATION
// =====================================================

function calculateRisk(
  identifierAnalysis,
  correlations
) {

  let score = 0;

  const observations = [];

  // ---------------------------------------------------
  // ACCOUNT + EVIDENCE
  // ---------------------------------------------------

  for (const entry of identifierAnalysis) {

    if (entry.status !== "FOUND") {
      continue;
    }

    // Account itself exists

    score += 5;

    observations.push({

      source: entry.platform,

      type: "account_exists",

      title:
        `${entry.platform.toUpperCase()} ACCOUNT FOUND`,

      message:
        `A public ${entry.platform} account was confirmed for "${entry.identifier}".`,

      severity: "low",

      points: 5

    });

    // Actual evidence

    for (const evidence of entry.evidence || []) {

      let points = 0;

      let severity = "low";

      if (evidence.strength === "HIGH") {

        points = 10;
        severity = "medium";

      } else if (
        evidence.strength === "MEDIUM"
      ) {

        points = 5;

      }

      score += points;

      observations.push({

        source: entry.platform,

        type: evidence.type,

        title: evidence.title,

        message: evidence.description,

        severity,

        points

      });

    }

  }

  // ---------------------------------------------------
  // CORRELATIONS
  // ---------------------------------------------------

  for (const correlation of correlations) {

    const points =
      correlation.confidence === "HIGH"
        ? 15
        : correlation.confidence === "MEDIUM"
          ? 10
          : 5;

    score += points;

    observations.push({

      source: "correlation",

      type: correlation.type,

      title: "IDENTITY CORRELATION",

      message: correlation.explanation,

      severity:
        points >= 15
          ? "high"
          : "medium",

      points

    });

  }

  score =
    Math.min(score, 100);

  // ---------------------------------------------------
  // RISK LEVEL
  // ---------------------------------------------------

  let level;

  if (score >= 70) {

    level = "CRITICAL";

  } else if (score >= 45) {

    level = "HIGH";

  } else if (score >= 25) {

    level = "MEDIUM";

  } else {

    level = "LOW";

  }

  return {

    score,

    level,

    observations

  };

}

// =====================================================
// PHISHING / SOCIAL ENGINEERING SIMULATION
// =====================================================

function generatePhishingSimulation(formData, observations, osintFindings) {

  const username = (formData.username || "").trim();
  const name = (formData.name || "").trim();
  const email = (formData.email || "").trim();

  if (!username) {
    return {
      applicable: false,
      threat: "",
      attackSurface: [],
      email: null,
      simulation: null,
      whyItWorks: [],
      defenses: []
    };
  }

  const github = osintFindings.find(
    item => item.platform === "GitHub" &&
           item.category === "public_profile"
  );

  const displayName = osintFindings.find(
    item => item.platform === "GitHub" &&
           item.category === "display_name"
  );

  const repositories = osintFindings.find(
    item => item.platform === "GitHub" &&
           item.category === "public_repositories"
  );

  const foundInformation = [];

  if (github) {
    foundInformation.push(
      `Your GitHub account "${username}" is publicly visible.`
    );
  }

  if (displayName) {
    foundInformation.push(
      `Your public profile displays the name "${displayName.value}".`
    );
  }

  if (repositories) {
    foundInformation.push(
      `Your profile currently exposes ${repositories.value} public ${
        repositories.value === 1 ? "repository" : "repositories"
      }.`
    );
  }

  return {
    applicable: foundInformation.length > 0,

    threat: "ACCOUNT DEACTIVATION / REACTIVATION SCAM",

    attackSurface: foundInformation,

    email: {
      from: "GitHub Support <support@github-security.example>",
      to: email,
      subject: `Action required: Your GitHub account "${username}" has been deactivated`
    },

    simulation: {
      message: `
Hello ${username},

We detected that your GitHub account has been inactive for the past 60 days.

Your account associated with the username "${username}" has therefore been temporarily deactivated.

To prevent permanent loss of access to your repositories and profile, please verify your account and reactivate it using the secure link below:

[ REACTIVATE MY GITHUB ACCOUNT ]

Account: ${username}
Profile name: ${displayName?.value || name}

This verification must be completed within 24 hours.

If you do not complete the verification process, access to your account may be restricted.

GitHub Account Security Team
      `.trim()
    },

    whyItWorks: [
      "The message uses the target's real username.",
      displayName
        ? `It uses the publicly exposed name "${displayName.value}".`
        : "It uses information associated with the target's public profile.",
      "A familiar platform makes the message appear more believable.",
      "The urgency creates pressure to click before checking whether the message is legitimate."
    ],

    defenses: [
      "Do not click account-recovery links inside unexpected emails.",
      "Open GitHub directly through your browser instead of using the email link.",
      "Check the sender's real domain carefully.",
      "Never enter your password after following an unexpected security link.",
      "If an email creates urgency, stop and independently verify the claim."
    ]
  };
}

// =====================================================
// INVESTIGATION
// =====================================================
// =====================================================
// INVESTIGATION
// =====================================================

app.post("/investigate", async (req, res) => {

  console.log("\n========== INVESTIGATION START ==========");
  console.log("Request received:", req.body);

  try {

    const data = req.body;

    // 1. COLLECT OSINT
    const {
      osintFindings,
      identifierAnalysis
    } = await collectOSINT(data);

    console.log("Identifier analysis:");
    console.dir(identifierAnalysis, { depth: null });

    console.log("OSINT findings:");
    console.dir(osintFindings, { depth: null });


    // 2. CORRELATE IDENTITIES

    const correlations =
      correlateIdentities(identifierAnalysis);

    console.log("Correlations:");
    console.dir(correlations, { depth: null });


    // 3. CALCULATE RISK

    const risk =
      calculateRisk(
        identifierAnalysis,
        correlations
      );

    console.log("Risk:");
    console.dir(risk, { depth: null });


    // 4. UNCERTAINTIES

    const uncertainties =
      identifierAnalysis
        .filter(
          entry => entry.status === "UNVERIFIED"
        )
        .map(
          entry =>
            `${entry.platform} check for "${entry.identifier}" could not be independently confirmed.`
        );


    // 5. SOCIAL ENGINEERING SIMULATION

    const phishingSimulation =
  generatePhishingSimulation(
    data,
    risk.observations,
    osintFindings
  );


    // 6. FINAL RESULT

    const result = {

      ...risk,

      osintFindings,

      identifierAnalysis,

      correlations,

      uncertainties,

      phishingSimulation

    };


    console.log("Final result:");
    console.dir(result, { depth: null });

    console.log(
      "========== INVESTIGATION END ==========\n"
    );


    res.json(result);

  } catch (error) {

    console.error(
      "INVESTIGATION ERROR:",
      error
    );

    res.status(500).json({

      error: "Investigation failed",

      message: error.message

    });

  }

});

// =====================================================
// START SERVER
// =====================================================

app.listen(5000, () => {

  console.log(
    "Ciphantom backend running on port 5000"
  );

});