# SendaTender: GeM Bid Compliance & Statutory Verification Workbench
**Smart India Hackathon (SIH 2026) · Problem Statement PS 26100**
*Ministry of Petroleum & Natural Gas (MoPNG) | Government e-Marketplace (GeM)*

SendaTender is an automated, dual-persona compliance intelligence workbench engineered to eliminate tender processing delays, document discrepancies, and bid compliance bottlenecks in public procurement.

---

## 🌟 Key Features

### 1. Dual-Persona Architecture
- **🏢 Vendor Submission Workspace**:
  - Ingestion of multi-document tender packages (NIT/RFP, BOQ, GSTIN, PAN, Udyam MSME, Turnover ITR, Bank proofs).
  - Authentic client-side/server-side document content inspection (PDF binary text extraction, regex validation).
  - Immediate verification feedback with document classification.
- **👮 Officer Review Desk**:
  - **Secure Password-Protected Access**: Dedicated server-side officer authentication gating confidential bidder records.
  - **Dynamic Statutory Compliance Matrix**: Checkpoint-by-checkpoint analysis (`PASS`, `FAIL`, `REVIEW`, `MISSING`) across GSTN, PAN, Udyam, MCA21, and mandatory document suites.
  - **Statutory Evidence & "Explain Why" Breakdown**: Clear scoring rationale explaining exactly why a bidder received their compliance score and risk rating (`Low`, `Medium`, `High`).
  - **Decision Actions & Tamper-Proof Audit Trail**: Officers can record official decisions (**Approve**, **Request More**, **Flag**) with officer identity, timestamp, and audit trail persistence.
  - **Signed Dossier Export**: Generate and download an authentic, formal PDF verification report with compliance tables, evidence, and audit logs.

### 2. Rigorous Content-Based Document Verification
- Verification results are evaluated on **actual document content**, not just file names:
  - **Blank / Corrupted Files**: Detected and flagged as `FAIL` with score penalties.
  - **Unverified / Fake Documents**: Lacking statutory numbers (GSTIN/PAN/Udyam) are flagged as `MISSING` or `FAIL`.
  - **Mismatched Documents**: Scanned for legal entity discrepancies between PAN, GST, and profile; flagged for `REVIEW`.
  - **Expired Certificates**: Detected during validity date scanning; flagged as `FAIL`.
  - **Valid Packages**: Evaluated against all statutory requirements and rewarded with `PASS` status.

### 3. Clear Separation of Demo Archetypes vs. Live Uploads
- Preloaded with **5 canonical SIH demo bidder scenarios**:
  1. *Fully Compliant* (96% Score, Low Risk)
  2. *Missing Documents* (72% Score, Medium Risk)
  3. *Expired Certificate* (64% Score, Medium Risk)
  4. *Name/Address Mismatch* (58% Score, High Risk)
  5. *Multiple Issues* (35% Score, High Risk, Flagged)
- User-uploaded packages are processed dynamically without overwriting or being masked by preloaded data.

---

## ⚠️ Mock Government API Disclaimer
> **IMPORTANT FOR SIH EVALUATION**:  
> All statutory database checks (GSTN, Income Tax PAN, Udyam MSME, and MCA21) are executed using high-fidelity **Mock Verification Engines** (`MOCK GOVERNMENT CHECK — SIH DEMO`). In a live deployment, these modules connect directly to API Setu, GSTN GSP, and MCA21 gateways. No live government database credentials are required to run this prototype.

---

## 🚀 Setup & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- npm (v9.x or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/darshilh20-spec/sendatender.git
cd sendatender
npm install
```

### Starting the Application
```bash
npm start
```
The application will start on: **`http://localhost:3000`**

---

## 🔒 Officer Portal Access Credentials

Access to the **Officer Review Desk** is restricted. When clicking the Officer Portal tab, you will be prompted for authentication:

| Field | Demo Credential |
| :--- | :--- |
| **Officer ID** | `OFFICER2026` |
| **Password** | `Senda@2026` |

*(Note: Password is case-sensitive.)*

Credentials can also be customized using environment variables:
- `OFFICER_ID`: Custom officer ID (defaults to `OFFICER2026`)
- `OFFICER_PASSWORD`: Custom officer password (defaults to `Senda@2026`)
- `PORT`: HTTP port (defaults to `3000`)

---

## 📂 Project Structure
```
sendatender/
├── backend/
│   ├── data/
│   │   └── bidders.json        # Persistent bidder store with 5 standard archetypes
│   ├── uploads/                # Isolated upload storage (.gitkeep)
│   ├── mockGemini.js           # Gemini AI extraction simulator
│   ├── mockGovChecks.js        # Statutory API Setu / GSTN / PAN simulation
│   └── server.js               # Express application server with inspection & PDFKit engine
├── app.js                      # Frontend application logic, API integration, and audit controller
├── index.html                  # Responsive multi-portal workspace (Overview, Vendor, Officer Desk)
├── styles.css                  # Enterprise design system with constrained visual scaling
├── package.json                # Project dependencies and start scripts
├── .gitignore                  # Protection against secret leaks and node_modules
└── README.md                   # Project documentation & SIH evaluation guide
```

---

## 🛡️ Security & Integrity Practices
- No `.env` files, API keys, or private session secrets are committed to version control.
- Frontend scripts never evaluate passwords client-side; all authentication happens via server-side verification (`POST /api/officer/login`).
- File uploads are validated and stored in server directories protected against directory traversal.
