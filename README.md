# E-Learning Application

A full-stack MERN capstone project featuring role-based functionality for administrators, faculty members, and students.

## Planned Features

### Admin

- Manage application users
- Manage courses
- Assign and review user roles

### Faculty

- Create and manage courses
- Manage coursework
- Review student enrollment requests
- Evaluate student submissions

### Students

- Search available courses
- Request enrollment
- Access course materials
- Complete coursework
- Review completed courses

## Technology Stack

- MongoDB
- Mongoose
- Express.js
- React
- Node.js
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

## Project Status

Initial backend architecture and user authentication workflow are under development.
