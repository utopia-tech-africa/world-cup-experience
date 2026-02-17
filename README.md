# World Cup Experience Booking Platform

A full-stack web application for Altair Logistics that enables customers to book World Cup travel packages with flight tickets, accommodation, and optional add-ons.

## Project Structure

```
world-cup-experience/
├── backend/          # Express.js API server
├── frontend/         # Next.js frontend application
└── .cursor/          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (package manager)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Set up the database:
```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed the database (optional)
pnpm prisma:seed
```

5. Start the development server:
```bash
pnpm dev
```

The backend API will be available at `http://localhost:5000/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL and payment account details
```

4. Start the development server:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Development

### Running Both Servers

You can run both servers concurrently from the root directory:

```bash
# Install concurrently (if not already installed)
pnpm add -D concurrently

# Run both servers
pnpm dev
```

## Tech Stack

### Backend
- Express.js with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- Nodemailer for emails
- Multer for file uploads
- Zod for validation

### Frontend
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- React Hook Form with Zod
- Axios for HTTP requests

## Features

### Customer Features
- Package selection (Single Game / Double Game)
- Accommodation type selection (Hotel / Hostel)
- Optional add-ons selection
- Booking form with validation
- Payment proof upload
- Email notifications

### Admin Features
- Secure login
- View all bookings with filters
- View booking details
- Confirm/reject bookings
- Email notifications for confirmations/rejections

## Environment Variables

See `.env.example` files in both `backend/` and `frontend/` directories for required environment variables.

## Database Schema

The database schema is defined in `backend/prisma/schema.prisma`. Run migrations to apply changes:

```bash
cd backend
pnpm prisma:migrate
```

## License

ISC
