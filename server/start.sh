#!/bin/sh

# Run database migrations
echo "Running database migrations..."
npx prima generate
npx prisma migrate deploy
npm run seed

# Start the application
echo "Starting the application..."
npm run dev