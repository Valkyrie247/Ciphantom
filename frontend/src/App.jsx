import { useState } from "react"; // state is memory , react need memory 
import "./App.css";

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


//Hero is the MVP of the website, the main peice
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
        Give me a handle and I'll show you exactly what
        a stranger could piece together about you in
        five minutes.
      </p>
    </section>
  );
}
function CaseFile({ setRisk }) {

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    github: "",
    linkedin: "",
    instagram: ""
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


  function validateGithub(github) {

    const value = github.trim();

    if (!value) {
      return "";
    }

    const githubPattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9._-]+\/?$/;

    const usernamePattern =
      /^[a-zA-Z0-9-]+$/;

    if (
      !githubPattern.test(value) &&
      !usernamePattern.test(value)
    ) {
      return "Enter a valid GitHub username or profile URL";
    }

    return "";

  }


  function validateLinkedin(linkedin) {

    const value = linkedin.trim();

    if (!value) {
      return "";
    }

    const usernamePattern =
      /^[a-zA-Z0-9._-]+$/;

    const urlPattern =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\s]+$/i;

    if (
      !usernamePattern.test(value) &&
      !urlPattern.test(value)
    ) {
      return "Enter a valid LinkedIn username or profile URL";
    }

    return "";

  }


  function validateInstagram(instagram) {

    const value = instagram.trim().replace(/^@/, "");

    if (!value) {
      return "";
    }

    const instagramPattern =
      /^[a-zA-Z0-9._]+$/;

    if (!instagramPattern.test(value)) {
      return "Enter a valid Instagram username";
    }

    if (value.length > 30) {
      return "Instagram username must be 30 characters or less";
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


    const githubError =
      validateGithub(formData.github);

    if (githubError) {
      newErrors.github = githubError;
    }


    const linkedinError =
      validateLinkedin(formData.linkedin);

    if (linkedinError) {
      newErrors.linkedin = linkedinError;
    }


    const instagramError =
      validateInstagram(formData.instagram);

    if (instagramError) {
      newErrors.instagram = instagramError;
    }


    setErrors(newErrors);


    const isValid =
      Object.keys(newErrors).length === 0;


    if (isValid) {

      setLoading(true);

    }


    return isValid;

  }

  async function investigate() {
  const response = await fetch("http://localhost:5000/investigate", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(formData)
  });

  const result = await response.json();

  console.log("Backend response:", result);

  setRisk(result);
}


async function handleInvestigation() {

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  setLoading(true);

  try {

    await investigate();

  } catch (error) {

    console.error("Investigation failed:", error);

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


      <label>GitHub</label>

      <input
        name="github"
        placeholder="optional"
        value={formData.github}
        onChange={handleChange}
      />

      {errors.github && (
        <p className="inputError">
          {errors.github}
        </p>
      )}


      <label>LinkedIn</label>

      <input
        name="linkedin"
        placeholder="optional"
        value={formData.linkedin}
        onChange={handleChange}
      />

      {errors.linkedin && (
        <p className="inputError">
          {errors.linkedin}
        </p>
      )}


      <label>Instagram</label>

      <input
        name="instagram"
        placeholder="optional"
        value={formData.instagram}
        onChange={handleChange}
      />

      {errors.instagram && (
        <p className="inputError">
          {errors.instagram}
        </p>
      )}


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


function RiskReport({ risk }) {

  return (

    <div className="panel">

      <div className="panelHeader">
        <h3>⚠ RISK REPORT</h3>
      </div>

      {!risk ? (

        <p className="reportText">
          Run an investigation to generate a live exposure score,
          cross-platform correlation map, and a set of countermeasures
          you can act on today.
        </p>

      ) : (

        <div className="riskResult">

          <p>EXPOSURE SCORE</p>

          <strong>{risk.score}/100</strong>

          <span>{risk.level}</span>
          <div className="findings">

  <h4>Observations</h4>

  {risk.observations?.map((observations, index) => (
    <div
      className={`observations ${observations.type}`}
      key={index}
    >

      <div className="findingHeader">
        <span>{observations.title}</span>
      </div>

      <p>{observations.message}</p>

    </div>

  ))}

</div>

        </div>

      )}

      <div className="riskTags">

        <span>✓ VERIFIED PUBLIC INFO</span>

        <span>⚠ CRITICAL EXPOSURE</span>

        <span>◎ RELATIONSHIP / LINK</span>

        <span>○ NEEDS ATTENTION</span>

      </div>

    </div>

  );

}

function Footer() {

  return (

    <footer>

      DISCLAIMER • For personal digital-privacy awareness only.

    </footer>

  );

}

export default function App() {
  const [risk, setRisk] = useState(null);

  return (

    <div className="app">

      <div className="background"></div>

      <Navbar />

      <Hero />

      <main className="dashboard">

        <CaseFile setRisk={setRisk} />

        <RiskReport risk={risk} />

      </main>

      <Footer />

    </div>

  );

}













//current state of the screen is landing 
// const means the variable itself cannot be reassigned.
//
// Primitive example:
// const x = 10;
// x = 20 ERROR
//
// Object example:
// const student = { name: "Alex" };
//
// student.name = "Ben" valid
// student = {} ERROR
//
// an object is present somewhere in memory.-> student always refers to that same object.
// We can modify the object's properties,
// but we cannot make student refer to a different object.


//array destructing 
// consider a fn: data() returning an array ["ben",24] => arr=data();
// usually we write const name= arr[0] ; const age=arr[1]
//but we can also use a shorthand assignment like [name,age]=data() , so first member is given to name and second to age


//useState function in react returns an array-> [currentvalue,updatefunction]
//screen = landing (what), setscreen = function (when)


/*formData
   ↓
current state

setFormData
   ↓
function that requests a state update



With brackets, JavaScript evaluates the expression first.

So:

[e.target.name]

could become:

["github"]

*/

