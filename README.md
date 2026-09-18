# SWIM - Water Resilience Digital Twin
### Cascading Failure Simulator for Rural Water Infrastructure

> **MIT Manipal Tech Tatva 2026 - Team MKCrusaders26**

---

## The One-Sentence Pitch

SWIM answers the question no existing water monitoring system can: **"Pump P1 is OFF -- what does that mean for the 6,400 people downstream, how many hours do they have before their taps run dry, and what should a block engineer fix first with a Rs.10 lakh O&M budget?"**

---

## The Problem That Actually Exists Today

India's Jal Jeevan Mission has geo-tagged **~6 crore rural water assets** across the country. Every block engineer can see whether a pump is ON or OFF in real time.

**What they cannot see is what comes next.**

When a power feeder trips and a pump stops, the overhead tank keeps feeding water downstream -- draining silently. A PHC might lose supply in 4 hours. A village with no alternate source might go 3 days without water. A school might close. This is not visible from any existing dashboard.

The standard response today is reactive: someone's tap runs dry, they file a complaint, the engineer dispatches a repair team. **The consequence has already happened.**

SWIM turns that into a proactive question: given this failure, here is exactly who is affected, in what order, how fast, and what the cheapest fix is -- **before** the taps run dry.

---

## Why This Is Solvable Right Now (The 2026 Gap)

The missing piece was never data. It was the **dependency model** sitting on top of existing data.

| What already exists | What was missing |
|---|---|
| JJM IMIS geo-tagged assets nationwide | Which pump depends on which power feeder |
| PHED pump records and tank capacities | How long a tank lasts once its pump fails |
| Census population-per-habitation data | Which villages, PHCs, and schools lose water first |
| Block engineers who know their schemes | A tool that converts their local knowledge into ranked priorities |

SWIM builds that missing dependency layer -- a typed graph of how every asset in a water scheme depends on every other -- and runs a cascade simulation on top of it. **No SCADA sensors. No IoT retrofits. No new data collection.** Just a model built from what JJM already has.

---

## What SWIM Actually Does

```
Source -> Pump -> Feeder (power) -> Overhead Tank -> Pipeline Zone -> Village / PHC / School
```

This is not a monitoring dashboard. It is a **what-if simulator**.

You select a failure -- a power feeder trips, a pump breaks down, a borewell yield drops -- and SWIM propagates the consequence through the full dependency chain:

1. The pump stops. Inflow to the tank drops to zero.
2. The tank drains at the demand rate of everything it feeds (55 LPCD x population served).
3. The system calculates exactly when the tank hits its critical threshold: `t* = (storage - minimum) / demand_rate`
4. Every village, PHC, and anganwadi downstream is marked affected at that time.
5. The system ranks every asset by **person-days of disrupted supply** -- a concrete, fundable number.
6. It then tells you the smallest, cheapest intervention that would have prevented it.

### The Core Technical Insight

A bridge failure is felt immediately. A pump failure is not -- the tank buys time. **That buffer is exactly what this system computes, and it is the single sentence no other water dashboard currently produces.**

> "Pump P1 is off. OHT1 will reach critical storage level in **6 hours**. Village Chakur (2,100 people) and PHC Chakur (serving 6,400) will lose water supply. No redundant pump exists. Intervention priority: **CRITICAL**."

---

## System Flow Illustration

The following screenshots show the full 7-step user flow of the SWIM prototype using live data from the Chakur Block, Latur scheme.

**Step 1 — Command Centre: Scheme Selection**

![Step 1 – Landing & Scheme Selection](src/github%20system%20flow/step-1.png)

---

**Step 2 — Live Network Map**

![Step 2 – Interactive Leaflet map of all 25 scheme assets](src/github%20system%20flow/step-2.png)

---

**Step 3 — Dependency Review**

![Step 3 – Inferred pump-to-feeder dependencies flagged for correction](src/github%20system%20flow/step-3.png)

---

**Step 4 — Failure Scenario Selection**

![Step 4 – Choose a failure: Feeder trip, Pipeline burst, Source depletion, or Worst case](src/github%20system%20flow/step-4.png)

---

**Step 5 — Cascade Animation**

![Step 5 – Round-by-round cascade with live map colouring](src/github%20system%20flow/step-5.png)

---

**Step 5 (continued) — Cascade in Progress**

![Step 5 – Cascade propagating through the network](src/github%20system%20flow/step-6.png)

---

**Step 6 — Impact Dashboard & Criticality Ranking**

![Step 6 – Population without water, hours to critical, ranked criticality table](src/github%20system%20flow/step-7.png)

---

**Step 7 — Scenario Comparison & Planning Report**

![Step 7 – Side-by-side scenario comparison and intervention recommendation](src/github%20system%20flow/step-8.png)

---

## Architecture

### 11-Stage Processing Pipeline

```mermaid
flowchart TD
    DS["Data sources\nJJM/IMIS scheme data, PHED GIS,\nCensus, UDISE+, health facility\nregistries, CGWB groundwater,\nexisting IoT telemetry where deployed"]

    S1["Stage 1\nFuse + tag provenance"]

    S2["Stage 2\nBuild the source-to-tap graph\nsource, pump, feeder, tank,\npipeline zone, village, school, PHC"]

    S3["Stage 3\nInfer dependencies\nwhich pump feeds which tank,\nconfidence-scored"]

    S4["Stage 4\nFailure coupling\npump / power / source / pipeline,\nor a manual what-if"]

    S5["Stage 5\nEquipment + source fragility\nreliability curves, not hazard curves"]

    S6["Stage 6\nDemand + storage initialisation\npopulation x LPCD vs tank volume"]

    S7["Stage 7\nCascade engine\nsymbolic + two-axis Monte Carlo,\nnow on a time axis, in hours"]

    S8["Stage 8\nCriticality, articulation points,\ntime-to-criticality ranking"]

    S9["Stage 9\nNeural surrogate, deferred"]

    S10["Stage 10\nScenario comparison\npaired, common random numbers"]

    S11["Stage 11\nCalibration engine\ncloses the loop against O&M\ncomplaint logs and IoT ground truth"]

    DS --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S6 --> S7
    S7 --> S8
    S7 --> S9
    S8 --> S10
    S9 --> S11
    S10 --> S11
    S11 -->|calibration feedback| S3
```



## Prototype -- What The Current Demo Shows

> **Important note:** The current prototype is a **hardcoded front-end demo** built for MIT Manipal Tech Tatva 2026. All data (nodes, edges, scenarios, cascade timelines) is pre-loaded from static TypeScript files representing the **Chakur Block, Latur District, Maharashtra** JJM water scheme. There is no live API, no database, and no real-time sensor feed. The prototype demonstrates the full 7-step user flow with realistic data to validate the concept and interface design. A production version would connect to the JJM IMIS API and a live dependency inference engine.

| Step | Screen | What it demonstrates |
|---|---|---|
| 1 | Landing | Problem framing + scheme selection |
| 2 | Network Map | Interactive Leaflet map of all 25 scheme assets with real Chakur Block coordinates |
| 3 | Dependency Review | Inferred pump-to-feeder dependencies flagged for human correction |
| 4 | Failure Selection | Choose: Feeder trip / Pipeline burst / Source depletion / Worst case |
| 5 | Cascade Animation | Round-by-round simulation with live map colouring -- red = failed, amber = stressed |
| 6 | Impact + Criticality | Population without water, hours to critical, facility count, ranked criticality table |
| 7 | Scenario Comparison | Side-by-side comparison + cost-effective intervention recommendation |

---

## Tech Stack

Everything used is **free, open-source, and production-ready**.

| Category | Tool | Version | Role |
|---|---|---|---|
| **Framework** | Next.js | 14.2.5 | React framework — page routing, SSR, API routes |
| **Language** | TypeScript | ^5 | Typed JavaScript — compile-time safety for simulation logic |
| **Styling** | Tailwind CSS | ^3.4.1 | Utility-first CSS — rapid, consistent component styling |
| **UI Runtime** | React | ^18 | Component model and state management |
| **Maps** | Leaflet | ^1.9.4 | Interactive geo-map rendering on OpenStreetMap tiles |
| **Maps (React)** | react-leaflet | ^5.0.0 | React wrapper for Leaflet — declarative map components |
| **Charts** | Recharts | ^3.10.1 | SVG charting library — impact dashboards and scenario comparisons |
| **Icons** | Lucide React | ^1.46.0 | Clean SVG icon set for all UI elements |
| **Fonts** | Google Fonts — Inter | latest | Primary typeface |
| **Type Defs** | @types/leaflet | ^1.9.22 | TypeScript types for Leaflet |
| **Linting** | ESLint + eslint-config-next | ^8 / 14.2.5 | Code quality enforcement |
| **Build Tool** | PostCSS | ^8 | CSS processing pipeline for Tailwind |
| **Runtime** | Node.js | 18+ | Dev server and build environment |
| **Package Mgr** | npm | 9+ | Dependency management |
| **Deployment** | Vercel | — | Zero-config Next.js hosting |

---

## Data Sources (Production Version)

| Source | Publisher | What it provides |
|---|---|---|
| **JJM IMIS** | Dept. of Drinking Water & Sanitation | Scheme assets, pump/tank locations, functionality status |
| **State PHED / RWS registries** | State governments | Scheme DPR figures, pump specs, tank capacities |
| **State DISCOM feeder records** | State electricity boards | Which feeder serves which pump connection |
| **CGWB / India-WRIS** | Central Ground Water Board | Groundwater levels -- source reliability fragility curves |
| **IMD** | India Meteorological Department | Rainfall and drought indicators |
| **Census / SECC** | Government of India | Population per habitation for demand estimation |
| **CPHEEO Manual** | Ministry of Housing and Urban Affairs | 55 LPCD design norm; 25-35% daily demand storage sizing |
| **BIS 10500** | Bureau of Indian Standards | Drinking water quality standard |

Every data input is tagged by provenance: `measured` (confirmed), `inferred` (confidence-scored), or `engineering default` (a named published standard). Nothing is silently assumed.

---

## The Core Simulation Formula (Plain English)

When a pump fails, the tank does not immediately run dry. It drains gradually:

```
Time to critical = (Current storage - Minimum safe level) / Demand rate per hour
```

**Example:**
- Tank OHT1: 100 kL total, currently 80 kL full
- Minimum safe level: 20 kL (20% threshold per CPHEEO standard)
- Demand: 1,100 people x 55 LPCD = 60.5 kL/day = 2.52 kL/hour
- **Time to critical = (80 - 20) / 2.52 = ~24 hours**

This one formula turns "Pump is OFF" into "you have 24 hours." The system computes this for every tank simultaneously, then propagates which villages and facilities run dry at which hours -- for any failure scenario, automatically.

---

## Running Locally

**Prerequisites:** Node.js 18+ and npm 9+

```bash
git clone https://github.com/SudarshanG9/MIT-TechTattva---Team-MKCrusaders26.git
cd MIT-TechTattva---Team-MKCrusaders26
npm install
npm run dev
```

Open http://localhost:3000 in your browser. The map requires an internet connection for OpenStreetMap tiles. All simulation logic runs entirely client-side.

---

## Complete 7-Step User Flow

### Step 1 -- Open the Command Centre

The engineer opens SWIM and sees the **Chakur Block, Latur** scheme preloaded: 25 assets, 34 dependency links, 8,140 people served under JJM. They click **Chakur Block** to load the digital twin.

---

### Step 2 -- Inspect the Network on the Live Map

A full-screen interactive map loads at real GPS coordinates. Every asset is pinned with a distinct icon:

- Borewells -- the root source of the water tree
- Pump Houses -- the only thing pushing water uphill into the tank
- Power Feeders -- the hidden dependency most dashboards ignore
- Overhead Tanks -- the time buffer the simulation measures
- Pipeline Zones -- the distribution network
- PHCs and Anganwadis -- critical facilities at the end of the chain
- Villages -- the demand nodes

Clicking any asset opens the **Asset Inspector panel**: criticality score, connected neighbours, and a provenance badge showing whether the dependency was confirmed from official data or inferred by the system (with confidence %). The two highest-risk assets -- borewell BW1 (sole source) and pump house P1 (no backup) -- are pre-highlighted in red callouts.

---

### Step 3 -- Review and Correct Inferred Dependencies

The system surfaces 2 dependency edges it is uncertain about:

- **P1 -> T1** (Main pump powered by Feeder 1 -- inferred from proximity, 68% confident)
- **OHT2 -> P2** (South tank backup supply -- may actually be P1, 71% confident)

For each, the engineer sees the confidence level, the reason for uncertainty, and a dropdown to either Confirm or Correct the assignment. When the engineer corrects an edge, the **System Calibration Score** increases. The "Introduce Failure" button unlocks only after both are reviewed.

---

### Step 4 -- Choose a Failure Scenario

Four scenarios are presented as cards with projected impact previews:

| Scenario | What it simulates | Severity |
|---|---|---|
| Feeder T1 Trip (Start Here) | Power cut to main pump | High |
| PZ3 Pipeline Burst | Break in central distribution pipe | Medium |
| BW1 Source Depletion | Borewell yield drops to 35% | Critical |
| Worst Case | Simultaneous T1 trip + P2 failure | Critical |

---

### Step 5 -- Watch the Cascade Animate Round by Round

The engineer clicks **RUN CASCADE**. The map comes alive:

- **T+0h:** Feeder T1 trips. Pump P1 loses power. Pump marker turns red.
- **T+2h:** Tank OHT1 draining silently. Fill level below 60%. Tank turns amber.
- **T+4h:** OHT1 hits critical storage (20%). Pipeline Zone PZ1 loses pressure. Three villages and PHC Chakur turn red.
- **T+6h:** PZ2 Central drains. Four more villages affected. **5,660 people without water.**

A timeline panel shows each event with the exact reason and node ID. The engineer sees immediately: this is a 6-hour emergency, not a 24-hour problem.

---

### Step 6 -- Read the Impact Dashboard and Criticality Ranking

**Impact Dashboard:** 5,660 people without water -- 3 facilities affected -- 8 assets offline -- 6 hours to critical -- Resilience score: 0.28/1.0 -- Est. cost: Rs.3-7 Lakh

**Criticality Ranking:** A ranked list of all 25 assets. Click any asset to expand its technical justification and intervention recommendation.

> Rank 2: P1 -- Main Pump House
> "No dedicated backup pump. Failure drains largest tank within 6 hours."
> Recommended: Install 100% standby pump parallel to P1 -- Rs.3-7 Lakh

---

### Step 7 -- Compare Scenarios and Generate the Planning Report

| Metric | Baseline | T1 + DG Backup | T1 Trip | Worst Case |
|---|---|---|---|---|
| Pop. without water | 0 | 0 | 5,660 | 7,280 |
| Time to critical | -- | 12 hours | 6 hours | 3 hours |
| Resilience score | 0.92 | 0.81 | 0.28 | 0.12 |
| Est. repair cost | Rs.0 | Rs.6-12L | Rs.3-7L | Rs.18-28L |

> "A Rs.6-12 Lakh investment in a DG backup for P1 prevents entire scheme failure. Restores water security to 5,660 people. Resilience improves from 0.28 to 0.81."

The engineer clicks **Generate MJP Report** -- a formatted summary ready for budget submission to the district PHED office.

---

## What This Is Not

- Not predictive maintenance. SWIM does not forecast when a pump will spontaneously fail. It simulates consequences once a failure is introduced.
- Not a real-time SCADA system. It does not poll live sensor feeds. It runs fast, deterministic simulations on scheme data that already exists.
- Not a monitoring dashboard. JJM IMIS already does monitoring. SWIM is the consequence layer on top.

---

## Team

**Team MKCrusaders26** - MIT Manipal - Tech Tatva 2026

---

## License

MIT License
