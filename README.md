# AirBNC

This is a portfolio website showcasing my projects as a developer.  
The goal of this project is to highlight my work and make it easy for others to explore what I’ve built.

## Database Setup

To create the database, run the SQL script:

```bash
psql -f db/create-database.sql
```

## Database Connection

This project uses a PostgreSQL connection pool with the `pg` package.  
Credentials are loaded from a `.env` file using the `dotenv` package.

### .env Example

PGDATABASE=your_database_name

Make sure to add `.env` to your `.gitignore` so your credentials aren’t committed.
