# AI Job Application Tracker (Backend)

A production-ready backend API to track job applications with authentication,
status history, skills mapping, and secure user-based access.

# 🚀 Features
- JWT Authentication (Register / Login)
- Secure CRUD for job applications
- Status history tracking (audit trail)
- Skills normalization (many-to-many)
- Pagination & filtering
- Centralized error handling

# 🛠 Tech Stack
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt

# 🔐 Authentication Flow
1. User registers
2. User logs in → receives JWT
3. JWT required for all protected routes

# 📌 API Endpoints

# Auth
- POST /auth/register
- POST /auth/login

# Jobs
- POST /jobs
- GET /jobs?page=&limit=&status=&company=
- PUT /jobs/:id
- DELETE /jobs/:id

# Job Extras
- GET /jobs/:id/history
- POST /jobs/:id/skills

# 🧪 Error Handling
All errors follow:
```json
{
  "success": false,
  "message": "Error message"
}

# Run Locally 
- npm install
- node src/server.js

