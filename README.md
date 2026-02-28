# Personal CRM

A self-hostable personal CRM focused on people and relationships, inspired by Monica, Clay, and Dex.

## Features

- **Contact Management**: Store rich contact details including emails, phones, addresses, social links
- **Relationship Graph**: Visualize connections between contacts with D3.js force-directed graph
- **Notes**: Keep track of interactions with markdown support
- **Tags**: Organize contacts with customizable tags
- **Custom Fields**: Define your own fields to track what matters to you
- **Reminders**: Never lose touch with keep-in-touch reminders
- **Full-Text Search**: Quickly find contacts and notes
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Knex.js, PostgreSQL
- **Frontend**: React 18, TypeScript, Vite, D3.js
- **Authentication**: JWT (access + refresh tokens)
- **Database**: PostgreSQL 16 with full-text search
- **Deployment**: Docker, Docker Compose

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd personal-crm

# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:8080
# API: http://localhost:3001
```

Default login:
- Email: `demo@example.com`
- Password: `demo1234`

### Manual Setup

#### Prerequisites

- Node.js 20+
- PostgreSQL 16+

#### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Seed demo data
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd client
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

The API is documented using OpenAPI 3.0. See `server/docs/openapi.yaml` for the complete specification.

### Authentication

All API endpoints (except `/auth/*`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Key Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/contacts` - List contacts
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/:id` - Get contact details
- `GET /api/v1/relationships/graph/:id` - Get relationship graph
- `GET /api/v1/search?q=query` - Search contacts and notes

## Project Structure

```
personal-crm/
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # Route definitions
│   │   ├── types/          # TypeScript types
│   │   ├── db/             # Database migrations
│   │   └── index.ts        # App entry point
│   └── docs/
│       └── openapi.yaml    # API documentation
├── client/                 # Frontend React app
│   └── src/
│       ├── api/            # API client
│       ├── components/     # React components
│       ├── context/        # React context
│       ├── pages/          # Page components
│       └── App.tsx         # Main app
└── docker-compose.yml      # Docker orchestration
```

## Development

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Database Migrations

```bash
cd server

# Create new migration
npm run migrate:make migration_name

# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback
```

### Environment Variables

#### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=personal_crm
DB_USER=crm
DB_PASSWORD=crm_secret
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Deployment

### Docker Production

```bash
# Production build
docker-compose -f docker-compose.yml up -d --build
```

### Manual Production

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the backend: `cd server && npm run build`
4. Build the frontend: `cd client && npm run build`
5. Serve the frontend with nginx or similar
6. Start the backend: `cd server && npm start`

## Roadmap

- [ ] Email notifications
- [ ] Bulk import/export (CSV, vCard)
- [ ] Contact merge
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Calendar integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by [Monica](https://www.monicahq.com/), [Clay](https://clay.earth/), and [Dex](https://getdex.com/)
- Built with modern web technologies
