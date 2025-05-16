#!/bin/bash

# Build application
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm test

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
