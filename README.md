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

### 1. Verification of Access Permissions

The court portal (`https://portal.scscourt.org`) was checked for a `robots.txt` file, which **does not exist**.  
This indicates that the site owner has not explicitly disallowed scraping.  
No terms of use or access policies explicitly prohibit read-only scraping for public data.

---

### 2. Ethical & Compliant Access

To ensure compliance and responsible scraping practices:

- A **rate limiter** was implemented to prevent overuse and ensure ethical behavior.
- The scraper performs **only necessary requests** for each search query.
- When a CAPTCHA or access restriction appears, the service **immediately stops** scraping and returns an appropriate message such as `"CAPTCHA detected"` or `"No results found"`.
- **No CAPTCHA bypassing, proxying, or automation** methods were used.

---

### 3. Mock Mode vs Live Mode

| Mode                    | Description                                                                      | Use Case                                             |
| ----------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Mock Mode (default)** | Parses pre-saved HTML fixtures under `/fixtures/`.                               | Safe offline testing without network requests.       |
| **Live Mode**           | Fetches and parses live data from the public court portal using Axios + Cheerio. | Demonstrates live scraping logic in a compliant way. |

Mode selection is controlled by the `MODE` environment variable.

```bash
MODE=mock docker compose up --build   # Mock (offline)
MODE=live docker compose up --build   # Live (with real HTTP requests)
```

---

### 4. Proxy & Network Safeguards

- No proxy rotation or IP obfuscation is used.
- All requests originate directly via Axios using standard headers.
- The scraper respects rate limits and gracefully handles access errors.
- No attempts are made to mimic browsers or evade firewall restrictions.

---

### 5. Compliance Statement

This project was built with full legal and ethical compliance:

- No CAPTCHA, reCAPTCHA, or WAF circumvention was attempted.
- All scraping logic can be run entirely offline in **mock mode**.
- The project respects court data integrity and access boundaries.

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
