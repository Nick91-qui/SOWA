# SOWA - Secure Online Web Assessment

This project is a Secure Online Web Assessment (SOWA) application designed to provide a robust and reliable platform for conducting online examinations. It features a FastAPI backend for API services and a Next.js frontend for the user interface, with integrated security monitoring and deployment configurations.

## Project Structure

```
. (root)
├── backend/             # FastAPI backend application
│   ├── app/             # Main application source code
│   │   ├── api/         # API endpoints (login, users, fraud)
│   │   ├── core/        # Core configurations (settings, security, database)
│   │   ├── models/      # SQLAlchemy database models (user, fraud_log)
│   │   ├── schemas/     # Pydantic schemas for data validation and serialization
│   │   ├── services/    # Business logic and service functions
│   │   ├── database.py  # Database connection and session management
│   │   ├── initial_data.py # Script to initialize admin user
│   │   └── main.py      # FastAPI application entry point
│   ├── tests/           # Backend tests
│   ├── poetry.lock      # Poetry lock file
│   ├── pyproject.toml   # Poetry project configuration and dependencies
│   ├── README.md        # Backend specific README
│   └── render.yaml      # Render deployment configuration
├── frontend/            # Next.js frontend application
│   ├── public/          # Static assets
│   ├── src/             # Frontend source code
│   │   ├── app/         # Next.js App Router (layout, pages)
│   │   └── utils/       # Utility functions (securityMonitor)
│   ├── vercel.json      # Vercel deployment configuration
│   ├── package.json     # Node.js project configuration and dependencies
│   ├── package-lock.json # Node.js dependency lock file
│   ├── next.config.ts   # Next.js configuration
│   ├── tsconfig.json    # TypeScript configuration
│   └── README.md        # Frontend specific README
├── docs/                # Documentation files
└── README.md            # Main project README (this file)
```

## Technologies Used

**Backend:**
- FastAPI: High-performance web framework for building APIs.
- SQLAlchemy: SQL toolkit and Object-Relational Mapper (ORM).
- PostgreSQL: Relational database.
- Pydantic: Data validation and settings management.
- Python-jose: JWT (JSON Web Token) implementation.
- Passlib: Password hashing library.
- Poetry: Dependency management and packaging.

**Frontend:**
- Next.js: React framework for building web applications.
- React: JavaScript library for building user interfaces.
- TypeScript: Superset of JavaScript that adds static typing.
- Tailwind CSS: Utility-first CSS framework.

## Features

**Backend:**
- User authentication with JWT.
- Secure password hashing.
- Fraud detection logging (fullscreen changes, Alt+Tab, right-click, key combinations).
- RESTful API endpoints for user management and fraud logging.

**Frontend:**
- Basic Next.js application structure.
- Client-side security monitoring (fullscreen, visibility, right-click, keydown).

## Setup and Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL database
- Poetry (for Python dependency management): `pip install poetry`

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Python dependencies using Poetry:**
    ```bash
    poetry install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory with your database URL and a secret key. Example:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    SECRET_KEY="your_super_secret_key_for_jwt"
    ACCESS_TOKEN_EXPIRE_MINUTES="30"
    ```

4.  **Run database migrations (if any) and initialize data:**
    (Note: This project currently uses SQLAlchemy models directly. For production, consider using Alembic for migrations.)
    You can run the `initial_data.py` script to create tables and an initial admin user:
    ```bash
    poetry run python -m app.initial_data
    ```

5.  **Run the FastAPI application:**
    ```bash
    poetry run uvicorn app.main:app --reload
    ```
    The backend will be accessible at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Next.js development server:**
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:3000`.

## Deployment

### Frontend (Vercel)

This project includes a `vercel.json` file in the `frontend` directory for easy deployment to Vercel. You can deploy directly from your Git repository connected to Vercel.

### Backend (Render)

This project includes a `render.yaml` file in the `backend` directory for deployment to Render. You can connect your Git repository to Render and use this blueprint for deployment. Remember to configure your database connection string and secret key in Render's environment variables.

## Security Considerations

- **JWT Security:** Ensure your `SECRET_KEY` is strong and kept confidential. Rotate it regularly.
- **Password Hashing:** Passwords are hashed using `bcrypt` via `passlib`.
- **Frontend Monitoring:** The `securityMonitor.ts` utility attempts to detect common cheating behaviors like exiting fullscreen, switching tabs, or using developer tools. Further actions (e.g., logging to backend, invalidating session) can be implemented based on these detections.
- **CORS:** FastAPI is configured with CORS settings. Adjust `settings.BACKEND_CORS_ORIGINS` as needed for your production environment.

## Contributing

(Add contributing guidelines here if applicable)

## License

(Add license information here if applicable)