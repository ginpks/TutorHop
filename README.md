# TutorHop

Tutor hop is a website where UMass students can easily search for, select and contact tutors that tutor in their area. It will be designed to be a personal hub for all tutor related information. It will hold the locations and times of tutoring classes and easily allow students and tutors to organise their schedules. Tutors can also use this platform to advertise their services and manage their timetables too.

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Library**: Material-UI (MUI)
- **Authentication**: JWT with bcrypt

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (if you're not using supabase like us)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ginpks/TutorHop.git
cd TutorHop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="..."
JWT_SECRET="..."
```

### 4. Database Setup

Run the database migrations using Drizzle:

```bash
npx drizzle-kit push
```

### 5. Build the Project

Build the frontend assets:

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

## Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your server configuration).

## Production

To run the application in production mode:

```bash
npm start
```

## Scripts

- `npm run dev` - Start development server with hot-reloading
- `npm start` - Start production server
- `npm run build` - Build frontend for production
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests with Jest

## Database Management (if you're running locally)

To generate new migrations after schema changes:

```bash
npx drizzle-kit generate
```

To push schema changes to the database:

```bash
npx drizzle-kit push
```

To open Drizzle Studio (database GUI):

```bash
npx drizzle-kit studio
```

## Project Structure

```
TutorHop/
├── drizzle/          # Database schema and migrations
├── public/           # Static assets
├── src/
│   ├── server/       # Backend Express server
│   └── client/       # Frontend React application
├── .env              # Environment variables (create this)
├── package.json      # Project dependencies
└── README.md         # This file
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:
- Verify PostgreSQL is running: `pg_isready`
- Check your `DATABASE_URL` in the `.env` file
- Ensure the database exists and credentials are correct

### Port Already in Use

If the development server fails to start due to port conflicts, check which process is using the port and either stop it or configure a different port in your server configuration.
