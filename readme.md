# AI Job Application Tracker (Full Stack)

A production-ready job application tracker with authentication, job CRUD, status history, skills mapping, and user-based access.

---

## 🚀 Features
- JWT Authentication (Register / Login)
- Secure CRUD for job applications (per-user)
- Status history tracking (audit trail)
- Skills normalization (many-to-many)
- Pagination & filtering
- Centralized error handling
- Basic React frontend (Login/Register/Dashboard)

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MySQL (Railway / Local)
- JWT
- bcrypt

### Frontend
- React (Vite)
- React Router
- Axios

---

## 🔐 Authentication Flow
1. User registers
2. User logs in → receives JWT
3. JWT required for all protected routes (`Authorization: Bearer <token>`)

---

## 📌 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Jobs
- `POST /jobs`
- `GET /jobs?page=&limit=&status=&company=`
- `PUT /jobs/:id`
- `DELETE /jobs/:id`

### Job Extras
- `GET /jobs/:id/history`
- `POST /jobs/:id/skills`

---

## 🧪 Error Handling
All errors follow:
```json
{
  "success": false,
  "message": "Error message"
}

#backend run 
npm install
npm run dev

#frontend run 
cd frontend
npm install
npm run dev