# E-Learning Application

A full-stack MERN capstone project featuring role-based functionality for administrators, faculty members, and students.

### Authentication

- User registration and login
- Password hashing with bcrypt
- Role-based authentication for Admin, Faculty, and Student users
- Student self-registration
- Restricted Admin registration

### Admin

- Admin dashboard
- Course creation
- User and course management functionality in development

### Faculty

- Faculty dashboard
- Course and coursework management functionality in development

### Students

- Student dashboard
- Browse available courses
- Search courses by partial title
- View matching course details
- Enrollment and coursework functionality in development

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt

## Architecture

The Express backend uses a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Mongoose Models
  ↓
MongoDB
```

This structure separates HTTP routing, request handling, business logic, database access, and data modeling.

## Project Structure

```text
Capstone_Project/
├── client/
│   └── src/
│       ├── pages/
│       └── services/
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── repositories/
        ├── routes/
        └── services/
```

## Project Status

Active development.

The application currently includes the MERN project structure, MongoDB persistence, user authentication, role-based dashboards, course creation, course browsing, and partial-title course search.

Current development is focused on expanding course management, enrollment workflows, coursework, and role-specific functionality.
