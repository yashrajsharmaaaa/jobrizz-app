-- Initialize JobRizz database
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional databases for different environments
CREATE DATABASE jobrizz_test;
CREATE DATABASE jobrizz_staging;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE jobrizz_dev TO jobrizz_user;
GRANT ALL PRIVILEGES ON DATABASE jobrizz_test TO jobrizz_user;
GRANT ALL PRIVILEGES ON DATABASE jobrizz_staging TO jobrizz_user;

-- Create extensions that might be useful
\c jobrizz_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c jobrizz_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c jobrizz_staging;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";