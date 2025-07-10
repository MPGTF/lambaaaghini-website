#!/bin/bash

echo "🐑 LAMBAAAGHINI → VERCEL DEPLOYMENT 🚀"
echo "====================================="
echo ""

# Check if Node.js and npm are available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Build the application
echo "📦 Building your Lambaaaghini website..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Starting Vercel deployment..."
echo ""
echo "📋 When prompted, use these settings:"
echo "   • Link to existing project: N"
echo "   • Project name: lambaaaghini"
echo "   • Directory: ./"
echo "   • Build Command: npm run build"
echo "   • Output Directory: dist/spa"
echo ""

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "========================"
    echo ""
    echo "✅ Your Lambaaaghini website is now live on Vercel!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Visit your vercel.app URL to test"
    echo "2. Add your GoDaddy domain in Vercel dashboard"
    echo "3. Update GoDaddy DNS to point to Vercel"
    echo ""
    echo "🎮 Your users will now experience:"
    echo "   • ⚡ 3-5x faster loading"
    echo "   • 🌐 Global CDN performance"
    echo "   • 📱 Perfect mobile experience"
    echo "   • 🔒 Automatic HTTPS"
    echo "   • 🎯 Optimized game performance"
    echo ""
    echo "🐑 Your professional sheep simulator is now professionally hosted! 🚀"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
