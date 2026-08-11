const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// ROOT
// =========================

app.get("/", (req, res) => {

  res.json({
    message: "Ciphantom backend is running"
  });

});


// =========================
// RISK CALCULATION
// =========================

function calculateRisk(data) {

  let score = 0;

  const observations = [];


  // Username

  if (data.username) {

    score += 20;

    observations.push({

      source: "username",

      type: "public_identifier",

      title: "USERNAME IDENTIFIER",

      message:
        `Username "${data.username}" supplied`,

      severity: "medium"

    });

  }


  // GitHub

  if (data.github) {

    score += 15;

    observations.push({

      source: "github",

      type: "platform_presence",

      title: "GITHUB PRESENCE",

      message:
        "GitHub identifier supplied",

      severity: "medium"

    });

  }


  // LinkedIn

  if (data.linkedin) {

    score += 15;

    observations.push({

      source: "linkedin",

      type: "platform_presence",

      title: "LINKEDIN PRESENCE",

      message:
        "LinkedIn identifier supplied",

      severity: "medium"

    });

  }


  // Instagram

  if (data.instagram) {

    score += 15;

    observations.push({

      source: "instagram",

      type: "platform_presence",

      title: "INSTAGRAM PRESENCE",

      message:
        "Instagram identifier supplied",

      severity: "medium"

    });

  }


  // =========================
  // CROSS PLATFORM
  // =========================

  const platforms = [
    data.github,
    data.linkedin,
    data.instagram
  ].filter(Boolean);


  if (platforms.length >= 2) {

    score += 15;

    observations.push({

      source: "cross_platform",

      type: "correlation",

      title: "CROSS-PLATFORM CORRELATION",

      message:
        `${platforms.length} platform identifiers supplied`,

      severity: "high"

    });

  }


  if (platforms.length === 3) {

    score += 10;

    observations.push({

      source: "cross_platform",

      type: "multi_platform_exposure",

      title: "MULTI-PLATFORM EXPOSURE",

      message:
        "Identifiers supplied for GitHub, LinkedIn and Instagram",

      severity: "high"

    });

  }


  // =========================
  // RISK LEVEL
  // =========================

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


// =========================
// INVESTIGATION
// =========================

app.post("/investigate", (req, res) => {

  const data = req.body;

  console.log("Investigation received:");
  console.log(data);


  const risk = calculateRisk(data);


  console.log("Risk result:");
  console.log(risk);


  res.json(risk);

});


// =========================
// START SERVER
// =========================

app.listen(5000, () => {

  console.log(
    "Ciphantom backend running on port 5000"
  );

});