# AirBNC

This is a portfolio website showcasing my projects as a developer.  
The goal of this project is to highlight my work and make it easy for others to explore what I’ve built.

## Dependencies

Install all required Node.js packages with:

```bash
npm install
```

## Database Setup

To create the database, run the SQL script:

```bash
npm run create-dbs
```

## Database Connection

This project uses a PostgreSQL connection pool with the `pg` package.  
Credentials are loaded from a `.env` file using the `dotenv` package.

## Seed Database

To seed test database:

```bash
npm run seed-test
```

To seed development database:

```bash
npm run seed-dev
```

To seed production database;

```bash
npm run seed-prod
```

### .env Example

PGDATABASE=your_database_name

## Start the app

To start the app in development mode:

```bash
npm run dev
```

## Tests

To run the all tests:

```bash
npm test
```

Or just to run the app:

```bash
npm run test-app
```

Or just to run the authorisation:

```bash
npm run test-auth
```

## Live API

To view the live API:  
[Click here to access the Portfolio Backend API](https://airbnc-b0sn.onrender.com)

To test specific endpoints, add `/api/<endpoint>` to the end of the URL.  
For example: `https://airbnc-b0sn.onrender.com/api/properties`
