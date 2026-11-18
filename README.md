# 💰 SpendWise – Smart Personal Finance Manager

> A full-stack personal finance management application built with **React.js**, **Java Spring Boot**, and **MySQL**.

![SpendWise Banner](https://img.shields.io/badge/SpendWise-Finance%20Manager-1e3a5f?style=for-the-badge&logo=data:image/svg+xml;base64,)
![Java](https://img.shields.io/badge/Java%2017-Spring%20Boot%203-6DB33F?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React%2018-Vite-61DAFB?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL%208-Database-4479A1?style=flat-square&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS%203-Styling-38B2AC?style=flat-square&logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

| Module | Features |
|---|---|
| 🔐 **Authentication** | Register, Login, JWT auth, BCrypt passwords, Profile management |
| 📊 **Dashboard** | Total balance, income, expenses, savings, charts & trends |
| 💵 **Income** | Add / Edit / Delete income by category with payment method |
| 💸 **Expenses** | Full CRUD, search, filter by category & date, sort |
| 🎯 **Budgets** | Monthly category budgets, progress bars, 80%/100% warnings |
| 📈 **Analytics** | Monthly trends, category breakdown, weekly spending (Recharts) |
| 🏦 **Savings Goals** | Create goals, track progress, add contributions |
| 📃 **Transactions** | Unified view, pagination, search & filter |
| 🌙 **Dark Mode** | Full light / dark theme toggle |
| 📱 **Responsive** | Mobile-first layout via Tailwind CSS |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | Component-based UI |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | 2.x | Data visualization |
| Lucide React | 0.33x | Icon library |
| React Hot Toast | 2.x | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 (LTS) | Language |
| Spring Boot | 3.2.3 | Application framework |
| Spring Web | — | REST API |
| Spring Security | — | Auth & authorization |
| Spring Data JPA | — | Database ORM |
| JJWT | 0.12.3 | JWT tokens |
| Lombok | — | Boilerplate reduction |
| Maven | 3.x | Build & dependency management |
| Springdoc OpenAPI | 2.3.0 | Swagger UI |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8.x | Relational database |

---

## 📁 Project Structure

```
SpendWise/
├── frontend/                    # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/             # React Context (Auth, Theme)
│   │   ├── hooks/               # Custom hooks
│   │   ├── layouts/             # AuthLayout, MainLayout
│   │   ├── pages/               # Route pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Savings.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/            # Axios API services
│   │   ├── styles/              # Global CSS
│   │   ├── utils/               # Helpers & constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example             # Environment variable template
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                     # Spring Boot app
│   └── src/main/java/com/spendwise/
│       ├── config/              # Security, CORS, OpenAPI, DataInitializer
│       ├── controller/          # REST controllers
│       ├── dto/                 # Request & Response DTOs
│       │   ├── request/
│       │   └── response/
│       ├── entity/              # JPA entities
│       ├── exception/           # Custom exceptions & GlobalExceptionHandler
│       ├── repository/          # Spring Data JPA repositories
│       ├── security/            # JWT filter, provider, UserDetailsService
│       ├── service/             # Business logic
│       └── SpendWiseApplication.java
│   └── src/main/resources/
│       ├── application.properties          # Active config (uses env vars)
│       └── application-example.properties  # Template – copy & fill in
│
├── database/
│   ├── schema.sql               # Full database schema (8 tables)
│   └── sample_data.sql          # Sample data for demo
│
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Make sure the following are installed:

| Tool | Minimum Version | Download |
|---|---|---|
| Java JDK | 17 | [adoptium.net](https://adoptium.net) |
| Maven | 3.8+ | [maven.apache.org](https://maven.apache.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SpendWise.git
cd SpendWise
```

### 2. Database Setup

Open MySQL Workbench or the MySQL CLI and run:

```bash
# Step 1 – Create schema (tables, indexes, constraints)
mysql -u root -p < database/schema.sql

# Step 2 – Load sample data (optional but recommended for demo)
mysql -u root -p < database/sample_data.sql
```

> **Note:** The Spring Boot backend will also auto-create demo users (`john@example.com` and `jane@example.com` with password `password123`) on first startup via `DataInitializer.java`.

### 3. Backend Setup

```bash
cd backend
```

Copy and configure properties:

```bash
# Windows
copy src\main\resources\application-example.properties src\main\resources\application.properties

# macOS / Linux
cp src/main/resources/application-example.properties src/main/resources/application.properties
```

Edit `application.properties` and set your MySQL credentials (see [Environment Variables](#-environment-variables)).

Run the backend:

```bash
mvn spring-boot:run
```

Backend starts at → `http://localhost:8080`  
Swagger UI → `http://localhost:8080/swagger-ui.html`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at → `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to `http://localhost:8080` automatically.

### 5. Login

| Field | Value |
|---|---|
| Email | `john@example.com` |
| Password | `password123` |

Or register a new account from the Sign Up page.

---

## 🔐 Environment Variables

### Backend — `application.properties`

| Variable | Description | Default (dev only) |
|---|---|---|
| `DB_URL` | Full JDBC connection URL | `jdbc:mysql://localhost:3306/spendwise_db?...` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASS` | MySQL password | _(you must set this)_ |
| `JWT_SECRET` | Secret key for signing JWT tokens | Built-in dev key |
| `JWT_EXPIRATION` | Token expiry in ms | `86400000` (24 hours) |

**For local development**, simply edit `application.properties` directly.

**For production**, set these as OS environment variables or Docker env vars — never hardcode credentials.

### Frontend — `.env`

```bash
# Copy the template
cp frontend/.env.example frontend/.env
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL (for production build) |
| `VITE_APP_NAME` | App display name |

> In development, Vite's proxy handles `/api` requests — you don't need `VITE_API_BASE_URL`.

---

## 🗄 Database Setup

### Schema Overview

```sql
spendwise_db
├── users                  -- Accounts (1 per person)
├── income                 -- Income records (FK → users)
├── expenses               -- Expense records (FK → users)
├── budgets                -- Monthly category budgets (FK → users)
├── savings_goals          -- Savings targets (FK → users)
├── savings_contributions  -- Deposits toward a goal (FK → savings_goals)
├── recurring_transactions -- Recurring income/expense (FK → users)
└── notifications          -- User alerts (FK → users)
```

All foreign keys use `ON DELETE CASCADE`. Each table has proper indexes and NOT NULL constraints.

---

## 📡 API Documentation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login & get JWT |
| GET | `/api/users/profile` | ✅ | Get current user |
| PUT | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/dashboard/summary` | ✅ | Dashboard KPIs |
| GET | `/api/dashboard/monthly-trends` | ✅ | Monthly chart data |
| GET | `/api/dashboard/category-breakdown` | ✅ | Expense by category |
| GET/POST | `/api/income` | ✅ | List / add income |
| PUT/DELETE | `/api/income/{id}` | ✅ | Edit / delete income |
| GET/POST | `/api/expenses` | ✅ | List / add expense |
| PUT/DELETE | `/api/expenses/{id}` | ✅ | Edit / delete expense |
| GET/POST | `/api/budgets` | ✅ | List / create budget |
| PUT/DELETE | `/api/budgets/{id}` | ✅ | Update / delete budget |
| GET/POST | `/api/savings-goals` | ✅ | List / create goal |
| PUT/DELETE | `/api/savings-goals/{id}` | ✅ | Update / delete goal |
| POST | `/api/savings-goals/{id}/contributions` | ✅ | Add contribution |
| GET | `/api/transactions` | ✅ | Unified transaction list |

> 🔑 **Auth header:** `Authorization: Bearer <token>`

Full interactive docs available at `http://localhost:8080/swagger-ui.html` when the backend is running.

---

## 🏗 Building for Production

### Frontend

```bash
cd frontend
npm run build
# Output in frontend/dist/ — deploy to Nginx, Vercel, Netlify, etc.
```

### Backend

```bash
cd backend
mvn clean package -DskipTests
# Output: backend/target/spendwise-backend-0.0.1-SNAPSHOT.jar
java -jar target/spendwise-backend-0.0.1-SNAPSHOT.jar
```

### Production Checklist

- [ ] Set `DB_PASS`, `JWT_SECRET` as environment variables (not in code)
- [ ] Change `spring.jpa.hibernate.ddl-auto` to `validate` or `none`
- [ ] Set `spring.jpa.show-sql=false`
- [ ] Use HTTPS (configure SSL certificate or place behind Nginx reverse proxy)
- [ ] Set `logging.level.org.springframework.security=WARN`
- [ ] Update CORS allowed origins in `CorsConfig.java` to your production domain
- [ ] Use a strong (32+ char) `JWT_SECRET` in production

---

## 📂 Income Categories

`Salary` · `Freelancing` · `Business` · `Investments` · `Gifts` · `Other`

## 📂 Expense Categories

`Food` · `Transportation` · `Shopping` · `Entertainment` · `Education` · `Healthcare` · `Rent` · `Bills & Utilities` · `Travel` · `Groceries` · `Other`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes as part of a Full Stack Web Development (FSWD) course project.

---

<p align="center">Built with ❤️ using React, Spring Boot & MySQL</p>
