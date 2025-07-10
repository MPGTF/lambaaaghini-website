#!/bin/bash

echo "🚀 Building Lambaaaghini for production deployment..."
echo "================================================="

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Files ready for deployment in: dist/spa/"
    echo ""
    echo "🌐 Next steps for GoDaddy deployment:"
    echo "1. Login to your GoDaddy hosting account"
    echo "2. Open cPanel File Manager"
    echo "3. Navigate to public_html folder"
    echo "4. Upload ALL files from dist/spa/ folder"
    echo "5. Extract files if uploaded as ZIP"
    echo ""
    echo "📋 Files to upload:"
    ls -la dist/spa/
    echo ""
    echo "⚠️  Important notes:"
    echo "- Ensure HTTPS is enabled for Solana wallet connections"
    echo "- Clear any existing files in public_html before upload"
    echo "- The site may take 24-48 hours to fully propagate"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
