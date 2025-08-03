# SwiftLink - Full-Stack URL Shortener

SwiftLink is a modern, fast, and reliable URL shortener built with a powerful tech stack. This project has been architected to separate the frontend and backend concerns, providing a robust and scalable solution.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js with Express
- **Backend-as-a-Service (BaaS):** Appwrite (for Authentication)
- **Database (Metadata):** Appwrite Databases
- **Database (Analytics):** MySQL (external)
- **Payments:** Razorpay

---

## Project Structure

The project is cleanly separated into a `backend` server and a `src` directory for the frontend application.

```
/
├── backend/                # Node.js/Express backend
│   ├── middleware/         # Custom middleware (e.g., auth)
│   ├── routes/             # API and public route definitions
│   ├── services/           # Initializers for external services (Appwrite, DB)
│   ├── .env                # Local environment variables (gitignored)
│   ├── .env.example        # Example environment variables
│   ├── index.js            # Express server entry point
│   └── package.json
│
├── src/                    # React frontend source
│   ├── components/
│   ├── contexts/
│   ├── services/
│   ├── index.tsx
│   └── ...
│
├── index.html              # Main HTML file
└── README.md               # This file
```

---

## Setup & Installation

### 1. Backend Setup

The backend is a Node.js server responsible for handling URL redirects, payment processing, and all core business logic.

**a. Appwrite Configuration:**

1.  Create a project on [cloud.appwrite.io](https://cloud.appwrite.io).
2.  Under **Auth**, enable the Email/Password, Magic Link, and Google OAuth providers.
3.  Under **Databases**, create a new database (e.g., "SwiftLink DB").
4.  Inside the database, create a collection named `links`.
5.  Add the following attributes to the `links` collection:
    - `longUrl` (string, required)
    - `shortCode` (string, required, set as a key)
    - `userId` (string, required)
    - `createdAt` (string, required)
6.  Create an API Key with `databases.read`, `databases.write`, `databases.delete`, and `users.read` permissions.
7.  In your Appwrite project settings, add a new Web Platform. Use your frontend development URL (e.g., `http://localhost:5173`). Your backend domain (`http://localhost:4000`) is automatically trusted for server-side SDK calls.

**b. MySQL Database:**

This project assumes you have an external MySQL database.
1.  Connect to your MySQL instance.
2.  Create a table for tracking clicks:
    ```sql
    CREATE TABLE link_clicks (
      short_code VARCHAR(255) PRIMARY KEY,
      clicks INT DEFAULT 0
    );
    ```

**c. Razorpay Account:**

1.  Sign up for a [Razorpay account](https://razorpay.com/).
2.  Generate API Keys (Key ID and Key Secret) in test mode from the dashboard.

**d. Environment Variables:**

1.  Navigate to the `backend` directory: `cd backend`
2.  Create a `.env` file by copying the example: `cp .env.example .env`
3.  Fill in the values in your `.env` file with credentials from Appwrite, MySQL, and Razorpay.

**e. Install Dependencies & Run:**

```bash
# From the backend/ directory
npm install
npm start
```
The backend server will run on port `4000`.

---

### 2. Frontend Setup

The frontend is a standard React application built with Vite.

**a. Environment Variables:**

1.  In the root directory of the project, create a file named `.env`.
2.  Add the following environment variables, pointing to your Appwrite project and backend server.
    ```
    VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
    VITE_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_BACKEND_URL="http://localhost:4000"
    VITE_RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
    ```

**b. Install Dependencies & Run:**

This project uses `es-module-shims` and an import map, so there is no `npm install` step for the frontend. Simply serve the root directory. You can use a simple server like `live-server` or the "Live Preview" extension in VS Code on your specified port.

---

## Application Flow

### Authentication

1.  **Client-Side Authentication:** The user interacts with the login/signup forms on the frontend. The frontend uses the **Appwrite Client SDK** to handle the authentication flow (e.g., `account.createEmailPasswordSession`).
2.  **Session Cookie:** Upon successful authentication, Appwrite securely places an `httpOnly` session cookie in the user's browser. This cookie is automatically sent with all subsequent requests to your backend domain.

### Backend-Driven Business Logic

1.  **API Request:** The frontend makes an API call to the backend for any business operation (e.g., `POST /api/links` to create a new link).
2.  **Backend Authentication Middleware:** The backend Express server intercepts this request. A custom middleware extracts the session cookie.
3.  **Session Verification:** The backend uses the **Appwrite Server SDK** to verify the session with Appwrite's servers. This confirms the user's identity.
4.  **Protected Logic:** If the session is valid, the request is passed to the appropriate API controller. The controller then performs the required action (e.g., writing to the Appwrite database, updating the MySQL database). **The frontend never directly accesses any database.**
5.  **Response:** The backend sends a JSON response back to the frontend.

This architecture ensures that all sensitive operations and business logic are secured behind an authenticated API, with the backend acting as the single source of truth.