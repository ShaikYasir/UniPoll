#!/bin/bash

echo "🚀 Deploying Live Polling System to Vercel..."

# Build the client
echo "📦 Building client..."
cd client
npm run build
cd ..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your app should now be available at your Vercel URL"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard if needed"
echo "   2. Test the deployment with multiple users"
echo "   3. Check Socket.io connectivity"
