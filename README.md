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
