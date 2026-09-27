# SendaTender: GeM Bid Compliance & Statutory Verification Workbench
**Smart India Hackathon (SIH 2026) · Problem Statement PS 26100**
*Ministry of Petroleum & Natural Gas (MoPNG) | Government e-Marketplace (GeM)*

PRIMARY LIVE DEMO URL:
👉 **[https://darshilh20-spec.github.io/sendatender/](https://darshilh20-spec.github.io/sendatender/)**

GITHUB REPOSITORY:
👉 **[https://github.com/darshilh20-spec/sendatender](https://github.com/darshilh20-spec/sendatender)**

SendaTender is an automated, dual-persona compliance intelligence workbench engineered to eliminate tender processing delays, document discrepancies, and bid compliance bottlenecks in public procurement.

---

## 🚀 Execution Modes

### Mode 1 — GitHub Pages Demo Mode (Static Hosting)
- **URL**: `https://darshilh20-spec.github.io/sendatender/`
- Designed for SIH 2026 jury evaluation directly in the browser with **zero installation, zero server setup, and zero API keys**.
- Powered by `frontendDemoEngine.js` providing in-browser deterministic mock statutory registries (GSTN, PAN, Udyam MSME, MCA21), 5 canonical bidders, client-side document verification, Tender Buddy progress co-pilot, browser-side SHA-256 tamper-evident audit chaining, and client-side PDF export.

### Mode 2 — Full-Stack Localhost Mode (Node.js & Express)
- **URL**: `http://localhost:3000`
- Provides the complete full-stack Node.js/Express environment with server-side authentication, REST APIs, PDFKit document generation, and server regression test suites.

---

## 🌟 Key Features

### 1. Dual-Persona Architecture
- **🏢 Vendor Submission Workspace**:
  - Ingestion of multi-document tender packages (NIT/RFP, BOQ, GSTIN, PAN, Udyam MSME, Turnover ITR, Bank proofs).
  - Authentic document inspection and classification.
  - Multi-stage verification and submission readiness analysis (`READY`, `NOT READY`, `REQUIRES REVIEW`).
- **👮 Officer Review Desk**:
  - **Protected Access**: Server-side authentication on localhost, synthetic demo credentials (`OFFICER2026` / `Senda@2026`) on GitHub Pages.
  - **Statutory Compliance Matrix**: 8 canonical procurement requirements mapped to statutory evidence.
  - **Explain Why & HITL Review**: Human-In-The-Loop review allowing officers to inspect factual evidence, resolve/confirm findings, and add officer notes.
  - **TAMPER-EVIDENT AUDIT TRAIL**: Cryptographically linked SHA-256 hash chains recording actor, action, timestamp, previous hash, and current hash.
  - **Bidder Comparison Desk**: Side-by-side compliance overview across all active bidders without ungrounded ranking.
  - **PDF Verification Report**: Formal PDF dossier generation (client-side on GitHub Pages, PDFKit on Node.js).
- **🤖 Tender Buddy Co-Pilot**:
  - Multi-lingual AI assistant (English, Hindi, Marathi) offering grounded guidance on tender rules, missing documents, score breakdown, and compliance findings without disclosing competitor data.

---

## ⚠️ Statutory Verification & Demo Disclaimers
> **IMPORTANT FOR SIH EVALUATION**:  
> - **MOCK GOVERNMENT VERIFICATION**: All statutory database checks (GSTN, Income Tax PAN, Udyam MSME, and MCA21) represent simulated high-fidelity checks (`MOCK GOVERNMENT CHECK — SIH DEMO`). In a live national deployment, these modules connect directly to API Setu, GSTN GSP, and MCA21 gateways. No live government database credentials or API keys are required.
> - **SYNTHETIC CREDENTIALS**: Officer credentials (`OFFICER2026` / `Senda@2026`) are synthetic demo credentials for evaluation and prototype testing.
> - **PROTOTYPE REPORT**: Exported PDF documents are marked as: *"SIH Prototype Verification Report — Not an Official Government Document"*.
> - **TAMPER-EVIDENT AUDIT TRAIL**: Chained via SHA-256 cryptographic hashes for tamper-evidence.

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Starting the Local Server
```bash
npm install
npm start
```
Open: **`http://localhost:3000`**

### Running Test Suites
```bash
node scratch/test_phase1_2.js
node scratch/test_phase3.js
node scratch/test_progress_copilot.js
node scratch/run_attack_tests.js
node scratch/test_hitl.js
node scratch/test_command_center_matrix.js
```

---

## 🔒 Demo Officer Credentials
| Field | Demo Credential |
| :--- | :--- |
| **Officer ID** | `OFFICER2026` |
| **Password** | `Senda@2026` |
