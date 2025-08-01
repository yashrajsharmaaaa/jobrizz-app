-- Development-specific database initialization
-- Additional setup for development environment

\c jobrizz_dev;

-- Create development-specific indexes for better performance during development
-- These will be recreated by Prisma migrations in production

-- Enable query logging for development
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 0;
SELECT pg_reload_conf();

-- Create a development user with more permissions for debugging
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dev_admin') THEN
        CREATE ROLE dev_admin WITH LOGIN PASSWORD 'dev_password' SUPERUSER;
    END IF;
END
$$;