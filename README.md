# Email Leads Manager Server

Backend server for the Email Leads Manager application built with Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- **RESTful API** for managing leads, accounts, emails, and templates
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with cookie-based sessions
- **CSV Upload** for bulk lead import
- **Pagination** support for all list endpoints
- **Search and Filtering** capabilities
- **CORS** configured for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **csv-parser** - CSV file parsing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `PORT` (default: 4000)
   - Set `FRONTEND_URL` for CORS configuration

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Leads
- `GET /api/leads` - Get paginated leads (query: page, limit, search, status, assignedTo)
- `POST /api/leads` - Create a new lead
- `POST /api/leads/upload` - Upload CSV file with leads

### Accounts
- `GET /api/accounts` - Get paginated accounts (query: page, limit)
- `GET /api/accounts/:id` - Get a single account
- `POST /api/accounts` - Create a new account
- `PUT /api/accounts/:id` - Update an account
- `DELETE /api/accounts/:id` - Delete an account

### Emails
- `GET /api/emails` - Get paginated emails (query: page, limit, search)
- `POST /api/emails` - Create a new email

### Subject Templates
- `GET /api/subject-templates` - Get paginated subject templates (query: page, limit, search)

### Message Templates
- `GET /api/message-templates` - Get paginated message templates (query: page, limit, search, industry)

## Database Models

### Lead
- Email (required, unique)
- Status (enum: unused, sent, bad, bounced, opened, replied, demoed)
- Personal information (firstName, lastName, company, title, phone, etc.)
- Location (city, state, country)
- Social links (linkedin, website)
- Assigned email and timestamps

### Account
- Name (required)
- First name, last name
- Main email
- Timestamps

### Email
- Email address (required, unique)
- Associated account (reference)
- Timestamps

### SubjectTemplate
- Content (required)
- Usage statistics (used, replied, succeeded)
- Timestamps

### MessageTemplate
- Content (required)
- Industry
- Skills array
- Usage statistics
- Timestamps

### User
- Email (required, unique)
- Password (hashed)
- Timestamps

## Authentication

Currently, authentication middleware is commented out in routes. To enable:

1. Uncomment the `authenticateToken` import in route files
2. Uncomment the middleware usage: `router.use(authenticateToken)`

The JWT token is stored in HTTP-only cookies for security.

## CSV Upload Format

The CSV file should have a header row with the following columns (case-insensitive):
- Email (required)
- Status
- First Name / FirstName
- Last Name / LastName
- Company
- Title
- Phone
- LinkedIn
- Website
- City
- State
- Country
- Assigned To / AssignedTo

## Development

The server runs on port 4000 by default. Make sure your MongoDB instance is running before starting the server.

For development with auto-reload:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/email-leads-manager |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## License

ISC

