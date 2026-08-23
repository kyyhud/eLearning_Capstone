# E-Learning Application

A full-stack MERN capstone project designed to support role-based learning workflows for administrators, faculty members, and students.

The application uses a layered backend architecture, JWT authentication, MongoDB persistence, and role-specific React interfaces.

## Current Features

### Authentication & Authorization

- User login with JWT authentication
- Password hashing with bcrypt
- Protected backend routes using authentication middleware
- Role-based authorization for Admin, Faculty, and Student users
- Role-based frontend routing
- Student self-registration
- Faculty account creation restricted to administrators
- Password change functionality for authenticated users
- Authentication tokens stored for the active browser session

### Admin

- Admin dashboard
- View faculty members
- Add faculty members
- View and edit faculty profiles
- View students
- View and edit student profiles
- Delete users
- Create courses
- Assign an existing faculty member to a course
- Select course level during course creation
- Automatic course ID generation based on course level
- Set course status as Draft, Published, or Archived

### Faculty

- Faculty dashboard
- Faculty profile
- Faculty account settings
- Personal information management
- Password management
- Course and coursework management functionality in development

### Students

- Student dashboard
- Student profile
- Student account settings
- Personal information management
- Emergency contact information
- Skills and certification profile data
- Password management
- Browse available courses
- Search courses by partial title
- View matching course information
- Enrollment and coursework functionality in development

## Course Management

Courses use structured course IDs that also represent their course level.

```text
100 Level → Introductory
200 Level → Intermediate
300 Level → Advanced
400 Level → Expert / Specialized
```

Administrators select the appropriate course level rather than manually entering a course number.

The backend automatically generates the next available course ID within that level.

```text
101
102
103

201
202
203

301
302
303
```

Course records reference an assigned faculty member using the faculty user's MongoDB ObjectId.

Course statuses include:

```text
draft
published
archived
```

## User Identification

Faculty and student accounts receive application-specific numeric IDs in addition to their MongoDB ObjectIds.

These IDs are generated automatically using MongoDB-backed counters rather than being manually entered.

MongoDB ObjectIds remain responsible for database relationships and internal document references.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Architecture

The Express backend uses a layered architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Mongoose Model
  ↓
MongoDB
```

Each layer has a separate responsibility:

- **Routes** define API endpoints and apply middleware.
- **Controllers** handle HTTP requests and responses.
- **Services** contain application and business logic.
- **Repositories** handle database queries and persistence.
- **Models** define Mongoose schemas and database structure.

Authentication and authorization middleware protect routes before requests reach the controller layer.

## Project Structure

```text
Capstone_Project/
│
├── client/
│   └── src/
│       ├── assets/
│       │
│       ├── components/
│       │   ├── AuthenticatedLayout.jsx
│       │   └── Navbar.jsx
│       │
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── faculty/
│       │   ├── student/
│       │   └── shared/
│       │
│       └── services/
│           ├── authService.js
│           ├── courseService.js
│           └── userService.js
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── repositories/
        ├── routes/
        ├── services/
        ├── utils/
        └── app.js
```

Additional files and services are added as their corresponding application features are implemented.

## Authentication Flow

After a successful login, the server creates a JWT containing authenticated user information including the user's database ID and role.

Protected API requests send the token through the authorization header:

```text
Authorization: Bearer <token>
```

Backend authentication middleware:

1. Verifies the JWT.
2. Attaches the authenticated user information to the request.
3. Allows role-based authorization middleware to determine whether the user can access the requested resource.

This provides authentication and role-based authorization for protected application functionality.

## Development Approach

The project is being developed incrementally rather than creating unused application structure in advance.

New controllers, services, repositories, routes, pages, and supporting files are added as their corresponding functionality is implemented.

This keeps the project structure aligned with the actual application and avoids maintaining speculative or unused files.

## Project Status

**Active development**

The application currently includes its primary MERN architecture, MongoDB persistence, JWT authentication, role-based authorization, user management, faculty and student profile management, student self-registration, faculty administration, and initial course management functionality.

Current development is focused on expanding course workflows, enrollment, coursework, progress tracking, and other role-specific functionality.
