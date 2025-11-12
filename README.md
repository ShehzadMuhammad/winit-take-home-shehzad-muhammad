# 🧩 Full-Stack Engineer Take-Home — Shehzad Muhammad

### ✅ Project Overview

This project is a production-ready **NestJS API service** that scrapes the **Santa Clara County Superior Court public portal** using **Axios** for HTTP requests and **Cheerio** for HTML parsing.

The system supports two operational modes:

- **Mock Mode (default):**  
  Uses locally stored HTML fixtures to simulate live scraping.  
  This allows full end-to-end testing without network access or CAPTCHA interference.

- **Live Mode:**  
  Performs real-time scraping from the court portal.  
  Due to CAPTCHA and anti-bot measures on the site, live scraping is not possible during this submission.  
  The system, however, gracefully detects CAPTCHA responses and returns a clear `"CAPTCHA detected"` or `"No results found"` message without attempting to bypass them.

## ⚙️ Setup & Deployment Instructions

### Run the Project

**For Live Data (real-time scraping):**

```bash
make run_live
```

**For Mock Data (offline fixtures):**

```bash
make run_mock
```

**To Stop Containers:**

```bash
make down
```

---

## 🧾 Access & Anti-Bot Strategy (Legal and Operational)

This project adheres to strict legal and ethical standards when accessing the Santa Clara County Superior Court portal.

A rate limiter is implemented to prevent overuse and ensure responsible behavior. The scraper performs only the necessary requests for each search query. If a CAPTCHA or access restriction is detected, it immediately stops and returns a clear message such as "CAPTCHA detected" or "No results found".

All requests are made directly via Axios using standard headers — with no proxy rotation, IP obfuscation, browser spoofing, or firewall evasion. The scraper respects rate limits and gracefully handles access errors.

Additionally, the project supports a fully offline mock mode using recorded HTML fixtures, ensuring that development and testing can be done without live scraping.

No CAPTCHA, reCAPTCHA, or WAF circumvention was attempted, and the project fully respects court data integrity and access boundaries.

---

## 🧪 Example cURL Request and JSON Response

### Example Request

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jesse", "lastName": "Soliven"}'
```

### Example Response

```json
{
  "caseNumber": "25CV474276",
  "caseStyle": "Jpmorgan Chase Bank, N.a. vs Jesse Soliven",
  "caseType": "Collections Rule 3.740 Limited (09) - under 10,000 Case",
  "caseStatus": "Active Court",
  "filingDate": "9/3/2025 Case",
  "detailLink": "/case/NTg1OTcyNA%3D%3D",
  "courtLocation": "Civil",
  "parties": [
    { "name": "Jesse L Soliven", "role": "Defendant" },
    { "name": "Jpmorgan Chase Bank, N.a.", "role": "Plaintiff" },
    { "name": "Joan S Wagner", "role": "Jpmorgan Chase Bank, N.a." }
  ],
  "hearings": [],
  "source": {
    "url": "mock://fixture/Jesse_Soliven/25CV474276",
    "timestamp": "2025-11-12T02:09:01.584Z"
  }
}
```

---
