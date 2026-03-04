# List all available commands
list:
    @just --list

# Start the development server
dev:
    pnpm dev

# Generate database migrations
generate-migrations:
    pnpm drizzle-kit generate

# Apply database migrations
migrate:
    pnpm drizzle-kit migrate

# Seed the database with initial data
seed:
    pnpm seed

# Install packages
i:
    pnpm i

# Update packages to their latest versions
up:
    pnpm up --latest

# List all packages
ls:
    pnpm ls

# Check outdated packages
outdated:
    pnpm outdated

# biome check --write
biome:
    pnpm biome check --write