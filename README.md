# LearnEase Pro

LearnEase Pro is a full-stack learning management application built as a MERN certification capstone project. It supports connected workflows for administrators, faculty members, and students, including user administration, course creation, enrollment approval, coursework progress, course group chats, and student reviews.

The project demonstrates how a React client, REST API, and MongoDB database can work together while enforcing authentication, role-based authorization, ownership rules, and resource-level access on the server.

## Project Goals

LearnEase Pro was designed to demonstrate the ability to:

- Build a complete client-server application with the MERN stack.
- Model related application data with MongoDB and Mongoose.
- Design and consume a RESTful JSON API.
- Implement authenticated, role-specific user experiences.
- Enforce authorization in the API rather than relying on hidden React controls.
- Organize backend code into maintainable architectural layers.
- Validate data and return understandable feedback when an operation fails.
- Present each role's workflows through a consistent, responsive interface built with maintainable CSS.

## Core Features

### Authentication and authorization

- Student self-registration and administrator-managed faculty registration.
- Password hashing with bcrypt.
- Server-side password requirements for registration and password changes.
- JWT authentication with a 12-hour token lifetime.
- Browser-session token storage using `sessionStorage`.
- Authenticated React layouts that validate the current session with the API before rendering protected pages.
- Role-based middleware for administrator, faculty, and student endpoints.
- Resource-level authorization for profiles, assigned courses, enrollments, discussions, and course files.
- Current database records are checked during authenticated requests, so deleted or deactivated accounts do not retain access through an older token.
- API user responses omit password hashes and other authentication-only data.

### Administrator workflows

- View dashboard totals for active and inactive users and for draft, published, and archived courses.
- Create faculty accounts and maintain faculty profiles.
- View, update, activate, deactivate, and delete faculty and student accounts.
- Create courses and assign a valid faculty account.
- Select a course level and automatically generate the next course ID in that level.
- Edit course metadata, faculty assignments, categories, content, and lifecycle status.
- View course ratings and archived course records.

### Faculty workflows

- View a dashboard summary of assigned courses and pending enrollment requests.
- View and update the faculty member's own profile and customizable group-chat auto-refresh option.
- View assigned draft, published, and archived courses.
- Edit permitted fields only on assigned courses.
- Add, reorder, update, and remove course sections and content.
- Publish draft courses while leaving course reassignment and archival under administrator control.
- Upload supported course documents, presentations, videos, and recordings.
- Review and approve or reject enrollment requests for assigned courses.
- Participate in course-specific group chats for assigned courses.

### Student workflows

- Create a student account and manage profile, education, skills, certification, emergency-contact, and group-chat auto-refresh preference data.
- Browse and search published courses.
- Request enrollment and view pending, approved, or rejected status.
- Access coursework only after enrollment approval.
- Open authorized course resources and mark required content complete.
- View progress calculated from the course's current required content.
- Participate in course-specific group chats for enrolled courses.
- Submit one immutable rating and optional review after completing all required content.
- View dashboard summaries for pending requests, in-progress courses, and completed courses.

## Course Lifecycle

Courses progress through three application states:

| Status      | Meaning                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `draft`     | The course is being prepared and is not visible to students.                                                                      |
| `published` | Students can discover the course and request enrollment.                                                                          |
| `archived`  | The course remains available for historical reference but is restricted from further faculty editing and new discussion messages. |

Course visibility and permissions are enforced by the API. React conditionally displays the controls appropriate for each role, but the server remains the authoritative security boundary.

## Course and User Identification

MongoDB ObjectIds are used internally for document relationships, API routes, ownership checks, and authorization decisions.

Faculty members, students, and courses also receive human-readable numeric identifiers for display purposes. MongoDB-backed counters generate these values automatically and prevent users from changing them through profile or course updates.

Course IDs are grouped by the level selected during course creation:

| Level | Description           | Example IDs   |
| ----- | --------------------- | ------------- |
| 100   | Introductory          | 101, 102, 103 |
| 200   | Intermediate          | 201, 202, 203 |
| 300   | Advanced              | 301, 302, 303 |
| 400   | Expert or specialized | 401, 402, 403 |

## Technology Stack

### Client

- React 19
- React Router
- Axios
- Vite
- JavaScript and CSS

### Server

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- Multer

## Interface and Styling

The client uses straightforward CSS without a component library or utility framework. The interface is intentionally restrained so that course and account workflows remain the focus of the project.

- `index.css` defines the global foundation, including the color palette, typography, sizing defaults, focus indicators, and shared CSS variables.
- `App.css` organizes reusable application styles for navigation, page containers, forms, buttons, tables, status badges, feedback messages, dashboards, course content, and group chat.
- Administrator, faculty, and student pages share the same visual language while retaining their role-specific navigation and workflows.
- Forms use consistent labels, controls, disabled states, action placement, and success or error feedback.
- Tables preserve their semantic structure and allow horizontal scrolling on narrow screens rather than converting tabular information into unrelated layouts.
- Responsive adjustments keep navigation, forms, buttons, course content, and dashboards usable on common desktop and mobile widths.
- Visible keyboard focus states, readable contrast, clear disabled controls, and text-based status indicators support basic accessibility and usability.

## Application Architecture

The Express application uses a layered backend structure:

```text
HTTP request
    |
    v
Route and middleware
    |
    v
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Mongoose model
    |
    v
MongoDB
```

- **Routes** define API endpoints and attach authentication, role, and upload middleware.
- **Controllers** translate HTTP requests into service calls and construct HTTP responses.
- **Services** contain business rules, validation, ownership checks, and authorization decisions tied to specific resources.
- **Repositories** isolate database queries and persistence operations.
- **Models** define document structure, relationships, indexes, defaults, and schema validation.

On the client, page components manage role-specific workflows while service modules centralize Axios requests, bearer-token attachment, API configuration, and error normalization.

## Authentication Flow

1. The user submits an email address and password to the login endpoint.
2. The server verifies the credentials and account status.
3. The server signs a JWT containing the user's MongoDB ID.
4. The client stores the token and safe user data in `sessionStorage`.
5. Protected requests send the token in the HTTP authorization header:

   ```text
   Authorization: Bearer <token>
   ```

6. Authentication middleware verifies the token and reloads the current account from MongoDB.
7. Role middleware and service-layer checks determine whether the current user can perform the requested operation.
8. The authenticated React layout calls the current-user endpoint before rendering protected content.

This distinction is important: **authentication** establishes who the user is, while **authorization** determines what that authenticated user is permitted to access or change.

## Protected Course Resources

Uploaded course files are not exposed through a public static directory. The client requests each file through a protected API endpoint, and the server verifies the user's relationship to the course before sending it.

- Administrators may retrieve course files.
- Faculty may retrieve files only for assigned courses.
- Students may retrieve files only with an approved enrollment.

The client receives authorized file responses as binary `Blob` data and creates a temporary browser URL for viewing the resource.

Supported upload types include:

- Documents: PDF, DOC, DOCX, and TXT
- Presentations: PPT, PPTX, and PDF
- Video and recording content: MP4, WebM, and MOV
- External HTTP or HTTPS links

Uploads are limited to 50 MB and receive unique stored filenames to avoid collisions.

## API Conventions

The REST API is grouped around five resources:

| API group          | Responsibility                                                                   |
| ------------------ | -------------------------------------------------------------------------------- |
| `/api/users`       | Registration, login, current session, password changes, and user administration  |
| `/api/courses`     | Course discovery, creation, editing, assignment, and protected content retrieval |
| `/api/enrollments` | Enrollment requests, faculty decisions, coursework access, and progress          |
| `/api/reviews`     | Course review submission and rating summaries                                    |
| `/api/chat`        | Authorized course discussions                                                    |

Successful JSON responses generally use this shape:

```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

Errors use an appropriate HTTP status and a client-readable message:

```json
{
  "success": false,
  "error": "Description of the problem"
}
```

## Project Structure

```text
Capstone_Project/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/       Shared layout and navigation
|   |   |-- pages/
|   |   |   |-- admin/        Administrator dashboards and management pages
|   |   |   |-- auth/         Login and student registration
|   |   |   |-- faculty/      Faculty dashboards, courses, and settings
|   |   |   |-- shared/       Profiles, course details, editor, and discussion
|   |   |   `-- student/      Course discovery, coursework, and settings
|   |   |-- services/         Axios API modules
|   |   |-- App.css           Shared application and responsive styles
|   |   |-- App.jsx           Route definitions
|   |   |-- index.css         Global styles and CSS variables
|   |   `-- main.jsx          React entry point
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/           Database connection
|   |   |-- controllers/      HTTP request and response handling
|   |   |-- middleware/       Authentication, authorization, and uploads
|   |   |-- models/           Mongoose schemas
|   |   |-- repositories/     Database access
|   |   |-- routes/           REST endpoint definitions
|   |   |-- scripts/          Administrator seeding
|   |   |-- services/         Business and authorization rules
|   |   |-- utils/            Password and safe-response utilities
|   |   `-- app.js            Express entry point
|   |-- .env.example
|   `-- package.json
`-- README.md
```

## Local Setup

### Prerequisites

- A current Node.js LTS release and npm
- MongoDB running locally or an accessible MongoDB connection string

### 1. Install server dependencies

From the project root:

```bash
cd server
npm install
```

### 2. Configure the server

Copy `server/.env.example` to `server/.env` and replace the placeholder values:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/Capstone_Project
JWT_SECRET=replace_with_a_private_random_value
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=replace_with_a_valid_admin_password
```

Passwords must contain 12 to 64 characters and include at least one uppercase letter, lowercase letter, number, and special character.

Do not commit `.env`; it contains application secrets and local credentials.

### 3. Create the initial administrator

```bash
npm run seed
```

The seed script creates the configured administrator only when that email does not already exist.

### 4. Start the API

```bash
npm start
```

The API runs at `http://localhost:3000` with the example configuration.

### 5. Install and start the client

In a second terminal, return to the project root:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

The client uses `http://localhost:3000/api` by default. To use a different API location, create `client/.env.local` and define:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Available Commands

### Client

```bash
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run preview  # Preview the production build on port 5173
```

Run `npm run build` before `npm run preview`. Stop the development client first because both client commands use port `5173`.

### Server

```bash
npm start        # Start the Express server with Node.js
npm run dev      # Start with nodemon when nodemon is available
npm run seed     # Create the configured administrator account
```

## Verification

The completed application has been evaluated through:

- Postman testing of API endpoints and authorization responses.
- Manual end-to-end browser testing across all three user roles.
- Client lint and production-build verification.
- A final disposable automated verification covering authentication, role restrictions, course creation and publication, enrollment approval, coursework completion, group chats, reviews, profile ownership, and account deactivation.

The disposable verification data was removed after the test run; an automated test suite is not included in the repository.

## Engineering Decisions

- **Server-authoritative permissions:** UI visibility improves usability, while backend middleware and services enforce actual access control.
- **Database-backed session validation:** A validly signed token is not sufficient by itself; the current account must still exist and remain active.
- **ObjectId relationships:** MongoDB ObjectIds support reliable references and authorization checks, while numeric IDs remain presentation-oriented.
- **Layered server responsibilities:** Business logic stays out of route definitions and database queries stay in repositories.
- **Protected file delivery:** File authorization occurs before Express transfers an uploaded resource.
- **Derived progress:** Completion percentages are calculated from required content rather than trusted as client-submitted values.
- **Normalized client errors:** Axios service modules convert API failures into consistent JavaScript errors that page components can display.
- **Null-safe related data:** Interfaces remain usable when referenced users or courses have been removed.
- **Shared CSS without a UI framework:** Global variables and reusable selectors provide a cohesive, responsive interface while keeping the styling approachable and easy to trace from the existing JSX.

## Project Scope

LearnEase Pro is a completed certification capstone and portfolio demonstration. It is intended to show full-stack application design and coherent learning-management workflows rather than represent a commercially deployed learning platform.

Potential production-oriented extensions could include a repeatable automated test suite, HTTP-only cookie sessions with a deliberate CSRF strategy, authentication rate limiting, managed object storage for uploads, centralized application logging, unread-message tracking, and cloud deployment infrastructure.
