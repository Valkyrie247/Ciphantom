# Ciphantom V1.0

> **Reveal your digital shadow before someone else does.**

Ciphantom is an **OSINT-based digital footprint awareness tool** that demonstrates how publicly available information can be discovered, connected, and potentially used in social-engineering attacks.

Instead of simply telling users to "be careful online", Ciphantom lets them experience what a stranger could potentially piece together about them from their public digital footprint.

---

## The Problem

We often assume that small pieces of information we share online are harmless.

A username, display name, public repository, profile detail, or other seemingly insignificant piece of information may not reveal much by itself. However, when multiple pieces of publicly available information are combined, they can provide useful context for an attacker attempting to manipulate or deceive someone.

Traditional cybersecurity awareness often relies on articles, warnings, and best-practice lists.

**Ciphantom takes a more practical approach: it shows users what can be discovered about their digital footprint and demonstrates how that information could potentially be used against them.**

---

## The Solution

Ciphantom allows a user to investigate their publicly visible digital footprint and understand the potential risks associated with it.

The system:

- Collects publicly available information from supported platforms
- Structures discovered information as evidence
- Identifies potential username reuse across platforms
- Calculates an exposure/risk score
- Demonstrates a simulated social-engineering scenario using information from the investigation
- Provides defensive recommendations to help reduce digital exposure

The goal is **awareness, not exploitation**.

---

## Demo

### Dashboard

The Ciphantom dashboard introduces the investigation and allows the user to begin an audit of their digital footprint.
<img width="1315" height="908" alt="dashboard" src="https://github.com/user-attachments/assets/48f36a43-8fce-4f34-b8ae-3a4592cda69a" />


---

### Investigation

Users provide information such as their name, username/handle, and optional email or profile URL.

### Risk Report

Ciphantom processes the investigation and presents confirmed findings, an exposure score, identity correlations, and recommended actions.


<img width="1862" height="732" alt="riskreport" src="https://github.com/user-attachments/assets/45f74461-d83c-4207-b669-ec30cd22da47" />


---


<img width="1097" height="251" alt="rr2" src="https://github.com/user-attachments/assets/515d3baa-5562-4823-918f-e18293177485" />


---

### Social Engineering Simulation

The discovered information can be used to generate an educational simulation showing how a convincing social-engineering message could be constructed.

<img width="1185" height="887" alt="email" src="https://github.com/user-attachments/assets/e3164a73-124d-45cd-906c-84318a09644e" />


> **The simulated message is not sent to anyone.**

---


<img width="982" height="632" alt="precautions" src="https://github.com/user-attachments/assets/9c0ab261-8e19-48ba-a984-b8b36d42f213" />


## Features

### 🔎 GitHub OSINT

Ciphantom checks publicly accessible GitHub profile information using the GitHub REST API.

Depending on what is publicly exposed, the investigation can identify:

- Username
- Display name
- Public email
- Bio
- Location
- External website
- Public repository count
- Follower count

---

### 🔗 Username Correlation

A matching username does not automatically prove that multiple accounts belong to the same person.

Ciphantom therefore separates **platform discovery** from **identity correlation** and only creates correlations when the relevant accounts have been independently confirmed.

---

### 📋 Evidence-Based Findings

Discovered information is converted into structured evidence objects containing information such as:

- Platform
- Category
- Finding
- Observed value
- Visibility
- Confidence
- Source URL

This allows the risk analysis to work with structured evidence rather than unprocessed responses.

---

### ⚠️ Exposure / Risk Scoring

Ciphantom assigns weighted points to confirmed accounts, exposed information, and identity correlations.

The resulting score is classified into:

- LOW
- MEDIUM
- HIGH
- CRITICAL

The score is intended as an **awareness indicator**, not a measurement of the probability of being attacked.

---

### 🎭 Social Engineering Simulation

Ciphantom demonstrates how publicly available information can contribute to a social-engineering scenario.

The simulation uses information discovered during the **current investigation** rather than relying entirely on a fixed example.

For example, a simulated message may incorporate a discovered username or publicly exposed profile information to demonstrate why personalized phishing attempts can appear convincing.

---

### 🛡️ Defensive Recommendations

The system provides practical precautions such as:

- Avoiding unexpected account-recovery links
- Accessing services directly through their official websites
- Checking the real destination of links
- Never entering credentials into suspicious pages
- Using stronger authentication methods such as two-factor authentication or passkeys
- Independently verifying urgent security requests

---

## How It Works

```text
User Input
     ↓
OSINT Collection
     ↓
Evidence Extraction
     ↓
Identity Correlation
     ↓
Risk Analysis
     ↓
Social Engineering Simulation
     ↓
Defensive Recommendations
