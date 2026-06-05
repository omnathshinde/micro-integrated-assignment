# Investment Deal Management & Recommendation Platform

A scalable investment deal management & Recommendation platform built with Node.js, Express.js, Sequelize, and MySQL.

## Features

### Authentication & Authorization

- JWT Authentication
- Role Based Access Control (RBAC)
- Roles:
    - Admin
    - Corporate
    - Investor

### Deal Management

- Create Deal
- Update Deal
- Soft Delete Deal
- Restore Deal
- Advanced Filtering
- Pagination
- Smart Deal Status Updates

### Investor Profiling

- Risk Appetite
- Budget Range
- Preferred Industries

### Smart Deal Recommendation Engine

Recommendation score based on:

| Factor               | Weight |
| -------------------- | ------ |
| Risk Match           | 30%    |
| Industry Match       | 25%    |
| Budget Compatibility | 20%    |
| ROI Attractiveness   | 15%    |
| Popularity           | 10%    |

### Interest Engine

- Express Interest
- Update Interest
- Remove Interest

### Investment Engine

- Investment Validation
- Over-investment Prevention
- Transaction Support
- Deal Funding Tracking

### Analytic

- Dashboard Statistics
- Conversion Rate
- Monthly Trends
- Corporate Dashboard

---

## Technology Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- Argon2 Password Hashing
- Winston Logging
- ESLint
- Prettier
- Husky

---

## Project Structure

```text
src
├── app
│   ├── configs
│   ├── helpers
│   ├── middlewares
│   └── seed
│   └── app.js
│
├── modules
│   ├── auth
│   ├── deals
│   ├── industries
│   ├── investor-preference
│   ├── interests
│   ├── investments
│   └── analytics
│
├── models
└── server.js
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

# API Server
HOST=localhost
PORT=3000
HTTPS=false

SSL_KEY_PATH=./certs/privkey.pem
SSL_CERT_PATH=./certs/fullchain.pem
SSL_CA_PATH=./certs/chain.pem

# Database
DB_NAME=microintegrated
DB_USER=root
DB_PASS=root
DB_HOST=localhost
DB_DIALECT=mysql

# JWT
JWT_SECRET_KEY=
JWT_REFRESH_SECRET_KEY=
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Installation

## Clone Repository

```bash
git clone <repository-url>
cd project-folder
```

## Install Dependencies

```bash
npm install
```

---

## Run Application

Development:

```bash
npm run dev
```

Production Build:

```bash
npm run build
```

Start Production:

```bash
npm start
```

---

## Available Scripts

```bash
npm run dev
```

Run development server with nodemon.

```bash
npm run build
```

Build project using tsup.

```bash
npm start
```

Run production build.

```bash
npm run lint
```

Check lint issues.

```bash
npm run lint:fix
```

Auto fix lint issues.

```bash
npm run format
```

Format code using Prettier.

```bash
npm run format:check
```

Check formatting.

---

## Database Models

### User

```text
id
name
email
username
password
role
```

### Industry

```text
id
name
description
```

### Deal

```text
id
corporateId
industryId
companyName
description
expectedROI
riskLevel
riskScore
dealStatus
minInvestment
maxInvestment
targetAmount
currentRaisedAmount
closingDate
tags
```

### InvestorPreference

```text
id
userId
riskAppetite
minBudget
maxBudget
```

### InvestorPreferredIndustry

```text
id
investorPreferenceId
industryId
```

### Interest

```text
id
investorId
dealId
amount
```

### Investment

```text
id
investorId
dealId
amount
investmentStatus
```

---

## API Modules

### Authentication

```http
POST /auth/register
POST /auth/login
```

---

### Industries

```http
GET /industries
```

---

## Deals

```http
GET    /deals
GET    /deals/:id
POST   /deals
PUT    /deals/:id
DELETE /deals/:id
PATCH  /deals/:id
GET    /deals/recommended
```

---

## Investor Preferences

```http
GET  /investor-preference
POST /investor-preference
PUT  /investor-preference
```

---

### Interests

```http
GET    /interests
POST   /interests
PUT    /interests/:id
DELETE /interests/:id
```

---

### Investments

```http
GET  /investments
GET  /investments/:id
POST /investments
```

---

### Analytics

```http
GET /analytics/dashboard
GET /analytics/trends
GET /analytics/corporate
GET /analytics/d
```

---

### Deal Lifecycle

```text
OPEN
   ↓
PARTIALLY_FILLED
   ↓
CLOSED
```

Rules:

- OPEN → No investment received
- PARTIALLY_FILLED → Partial funding received
- CLOSED → Target amount reached OR closing date expired

---

## Recommendation Algorithm

Match score calculation:

```text
Risk Match           = 30
Industry Match       = 25
Budget Compatibility = 20
ROI Attractiveness   = 15
Popularity           = 10
```

Deals are returned sorted by highest match score.

---

## Security Features

- JWT Authentication
- Role Based Access Control
- Password Hashing using Argon2
- Input Validation
- SQL Injection Protection via Sequelize
- Rate Limiting
- Helmet Security Headers
- CORS Support

---

## Seed Data

The application includes:

- 1 Admin User
- 10 Corporate Users
- 10 Investor Users
- 16 Industries
- 2 Deals
- Investor Preferences

Default Admin:

```text
Username: admin
Password: Admin@123
```

---

## Author

Omnath Shinde | Software Engineer

Node.js | Express.js | MySQL | Sequelize | Angular
