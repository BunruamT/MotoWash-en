# Campus MotoWash Backend API

Production-grade NestJS API serving as the backend for Campus MotoWash, featuring authentication, booking management, LINE integration, and more.

## Features

- NestJS with Fastify adapter for high performance
- Supabase (PostgreSQL) with Row Level Security
- LINE Login (LIFF) & Messaging API integration
- JWT-based authentication with roles
- Real-time booking management
- PDF receipt generation
- Automated notifications via LINE
- Comprehensive test coverage
- Docker support
- CI/CD with GitHub Actions

## Prerequisites

- Node.js 18+
- npm 8+
- PostgreSQL 14+ (via Supabase)
- LINE Developer Account
- Supabase Account

## Environment Setup

Copy `.env.example` to `.env` and fill in the required values:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_MESSAGING_ACCESS_TOKEN=your_messaging_access_token
LIFF_AUDIENCE=your_liff_audience
RECEIPT_BASE_URL=http://localhost:3000/receipts
BOOKING_TIMEBLOCK_MINUTES=60
```

## Installation

```bash
# Install dependencies
npm install

# Set up database
npm run db:migrate
npm run db:seed

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/liff/verify` - Verify LINE LIFF token
- `POST /auth/admin/login` - Admin login

### Capacity
- `GET /capacity/availability?date=YYYY-MM-DD` - Get slot availability

### Bookings
- `POST /bookings` - Create booking (customer)
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id` - Update booking

### Admin
- `POST /admin/bookings/:id/approve` - Approve booking
- `POST /admin/bookings/:id/assign-runner` - Assign runner
- `POST /admin/bookings/:id/status` - Update status
- `POST /admin/payments/:id/confirm` - Confirm payment
- `POST /admin/receipts/:id/generate` - Generate receipt
- `POST /admin/broadcast/rain-delay` - Send delay notifications

### Webhook
- `POST /webhook/line` - LINE webhook endpoint

## Development

### Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations

1. Update schema in `sql/schema.sql`
2. Add new policies in `sql/policies.sql`
3. Run migration:
   ```bash
   npm run db:migrate
   ```

### Adding New Features

1. Create module: `src/feature/feature.module.ts`
2. Add components:
   - Controller: `src/feature/feature.controller.ts`
   - Service: `src/feature/feature.service.ts`
   - DTOs: `src/feature/dto/`
3. Import module in `app.module.ts`
4. Add tests: `src/feature/feature.spec.ts`

## Deployment

### Docker

```bash
# Build image
docker build -t motowash-api .

# Run container
docker run -p 3000:3000 --env-file .env motowash-api
```

### Production Checklist

1. Set secure environment variables
2. Configure CORS for production frontend
3. Enable rate limiting
4. Set up monitoring
5. Configure logging
6. Enable SSL/TLS
7. Set up database backups
8. Configure error tracking

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

ISC
