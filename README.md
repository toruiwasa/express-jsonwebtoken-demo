# Express JWT Demo

A full-stack authentication demo showcasing JWT implementation with access and refresh tokens in a modern monorepo setup.

## Overview

This project demonstrates a complete authentication system using Express.js backend with React frontend, featuring secure JWT token management, password hashing, and protected routes. Built as a learning resource for understanding modern authentication patterns.

## Features

- 🔐 **JWT Authentication** - Access & refresh token implementation
- 🔒 **Secure Password Hashing** - bcrypt with salt rounds
- 🍪 **HTTP-Only Cookies** - Secure token storage
- 🛡️ **Protected Routes** - Middleware-based route protection
- 🔄 **Token Refresh** - Automatic token renewal
- 📱 **React Frontend** - Modern UI with shadcn/ui components
- 🗄️ **PostgreSQL Database** - Drizzle ORM integration
- 🚦 **Rate Limiting** - Protection on authentication routes
- 🏗️ **Monorepo Structure** - Organized workspace with pnpm

## Tech Stack

### Backend

- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **express-rate-limit** - Rate limiting

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router 7** - Client routing
- **Vite** - Build tool

### DevOps

- **pnpm** - Package manager
- **Docker** - PostgreSQL container
- **SSL/TLS** - HTTPS support

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+
- **Docker** (for PostgreSQL)
- **mkcert** (for SSL certificates)
- **OpenSSL** (for JWT key generation)

## Quick Start

1. **Clone and install dependencies:**

```bash
git clone https://github.com/toruiwasa/express-jsonwebtoken-demo.git
cd express-jsonwebtoken-demo
pnpm install
```

2. **Generate SSL certificates:**

```bash
pnpm certs:create      # Creates HTTPS certificates
pnpm certs:jwt:create  # Creates JWT signing keys
```

3. **Start PostgreSQL:**

```bash
pnpm db:up
```

4. **Create environment file:**

```bash
# Create .env in root directory
echo "DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres
ACCESS_TOKEN_SECRET=your-secret-key-here
SERVER_PORT=4000" > .env
```

5. **Start development servers:**

```bash
# Terminal 1 - API server
cd apps/api
pnpm dev

# Terminal 2 - Web app
cd apps/web
pnpm dev
```

6. **Access the application:**

- Frontend: https://localhost:3000
- Backend: https://localhost:4000

## Usage

### Password Requirements

Passwords must contain:

- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Minimum 8 characters

### User Registration

1. Navigate to https://localhost:3000
2. Click "Sign Up"
3. Enter email and strong password (meeting requirements above)
4. Submit form to create account

### User Login

1. Click "Login"
2. Enter credentials
3. Access protected content after authentication

### Protected Routes

- `/protected` - Requires valid access token
- Automatic token refresh when expired
- Logout clears all tokens

## API Endpoints

### Authentication Routes

_Note: Authentication routes are rate-limited to prevent abuse_

#### POST `/signup`

Register a new user

```bash
curl -X POST https://localhost:4000/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}'
```

#### POST `/login`

Authenticate user and receive tokens

```bash
curl -X POST https://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123!"}' \
  -c cookies.txt
```

#### GET `/me`

Get current user info (requires authentication)

```bash
curl https://localhost:4000/me \
  -b cookies.txt
```

#### POST `/refresh_token`

Refresh access token using refresh token

```bash
curl -X POST https://localhost:4000/refresh_token \
  -b cookies.txt
```

#### POST `/logout`

Logout and clear tokens

```bash
curl -X POST https://localhost:4000/logout \
  -b cookies.txt
```

#### POST `/protected`

Access protected resource

```bash
curl -X POST https://localhost:4000/protected \
  -b cookies.txt
```

## Project Structure

```
express-jsonwebtoken-demo/
├── apps/
│   ├── api/                    # Express.js backend
│   │   └── src/
│   │       ├── auth/          # Authentication logic
│   │       │   ├── authController.ts
│   │       │   ├── authMiddleware.ts
│   │       │   ├── authRoutes.ts
│   │       │   └── authService.ts
│   │       └── index.ts       # Server entry point
│   └── web/                   # React frontend
│       └── src/
│           ├── components/    # React components
│           │   └── ui/       # shadcn/ui components
│           ├── contexts/      # React context
│           └── lib/          # Utility functions
├── packages/
│   ├── database/             # Database schema & config
│   └── shared/               # Shared types & utilities
├── certs/                    # SSL certificates & JWT keys
│   ├── cert.pem             # HTTPS certificate
│   ├── key.pem              # HTTPS private key
│   ├── jwt-private.pem      # JWT signing key
│   └── jwt-public.pem       # JWT verification key
└── docker-compose.yml        # PostgreSQL setup
```

## What This Demo Shows

### Authentication Concepts

- **Dual Token Strategy** - Short-lived access tokens + long-lived refresh tokens
- **Secure Cookie Storage** - HTTP-only, secure, SameSite cookies
- **Password Security** - bcrypt hashing with complex password requirements
- **Route Protection** - Middleware-based authorization
- **Rate Limiting** - Protection against brute force attacks

### Modern Development Practices

- **Monorepo Organization** - Shared packages and clean separation
- **Type Safety** - Full TypeScript implementation
- **Modern UI Components** - shadcn/ui component system
- **Security Best Practices** - HTTPS, secure headers, input validation

### Full-Stack Integration

- **API Design** - RESTful endpoints with proper error handling
- **State Management** - React Context for user state
- **Client-Server Communication** - Fetch API with credentials
- **Database Integration** - Modern ORM with type safety

## Development Commands

```bash
# Install dependencies
pnpm install

# Generate certificates
pnpm certs:create      # HTTPS certificates (requires mkcert)
pnpm certs:jwt:create  # JWT keys (requires OpenSSL)

# Database
pnpm db:up    # Start PostgreSQL
pnpm db:down  # Stop PostgreSQL

# Development (run in separate terminals)
cd apps/api && pnpm dev    # Start API server
cd apps/web && pnpm dev    # Start web app

# Build
cd apps/api && pnpm build  # Build API
cd apps/web && pnpm build  # Build web app

# Linting
cd apps/api && pnpm lint   # Lint API code
cd apps/web && pnpm lint   # Lint web code
```

## Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres

# JWT Secret (use a strong secret in production)
ACCESS_TOKEN_SECRET=your-super-secret-key-change-this-in-production

# Server Port
SERVER_PORT=4000
```

## Security Features

- **Password Complexity** - Enforced strong password requirements
- **Rate Limiting** - Applied to authentication endpoints
- **JWT Key Separation** - RSA keys for refresh tokens, HMAC for access tokens
- **Secure Cookies** - HTTP-only, secure, SameSite attributes
- **HTTPS Only** - All communication encrypted
- **Input Validation** - Schema validation on all inputs

## Security Notes

- **Development Only** - This demo uses self-signed certificates
- **JWT Secrets** - Use strong, unique secrets in production
- **Database Credentials** - Change default PostgreSQL password
- **CORS Configuration** - Currently allows localhost only
- **Rate Limiting** - Implemented only on auth routes in this demo

## License

ISC License - feel free to use this code for learning and experimentation.
