# Where Did My Money Go?

A simple personal expense tracker for everyday users and families (MERN stack, JWT auth).

## Problem Statement
People spend small amounts daily on food, groceries, travel and bills, but at month-end they don't know where the money went.

## Solution
Record expenses in seconds and get automatic totals, a category breakdown chart, monthly reports, and plain-language insights.

## Features
- Register / Login / Logout (JWT); each user sees only their own expenses
- Dashboard: today / week / month totals, expense count, top category, pie chart, insights
- Add, edit, delete expenses (with delete confirmation); search and filter by category and date
- Monthly summary by month and year, with highest category and month-over-month comparison (only when the previous month has data)
- Frontend + backend validation, loading, error and empty states; responsive layout

## Technology Stack
React (Vite), React Router, Axios, Recharts, plain CSS · Node.js, Express, JWT, bcryptjs · MongoDB + Mongoose

## Screenshots
_Add screenshots to `frontend/src/assets/` and link them here._

## Installation
Requires Node.js 18+ and a running MongoDB (local or Atlas).

### Environment variables
`backend/.env` (copy from `.env.example`): `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
`frontend/.env` (optional): `VITE_API_URL=http://localhost:5000/api`

### Run backend
```
cd backend && npm install && cp .env.example .env && npm run dev
```
### Run frontend
```
cd frontend && npm install && npm run dev
```
Open http://localhost:5173

## API Overview
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, returns JWT |
| POST | /api/expenses | Add expense |
| GET | /api/expenses?q=&category=&date= | List/search/filter |
| GET | /api/expenses/:id | Get one |
| PUT | /api/expenses/:id | Update |
| DELETE | /api/expenses/:id | Delete |
| GET | /api/expenses/summary?today=YYYY-MM-DD | Dashboard data |
| GET | /api/expenses/monthly-summary?month=10&year=2026 | Monthly report |

All `/api/expenses` routes need `Authorization: Bearer <token>` and are scoped to the logged-in user.

## Future Improvements
Family/shared expenses · Budget limits · Bill reminders · Export to Excel/PDF · Recurring expenses · Mobile app · AI-based spending insights
