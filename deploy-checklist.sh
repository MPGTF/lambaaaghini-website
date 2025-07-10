#!/bin/bash

echo "🐑 LAMBAAAGHINI DEPLOYMENT CHECKLIST 🚀"
echo "======================================="
echo ""

# Check if build exists
if [ -d "dist/spa" ]; then
    echo "✅ Build directory exists: dist/spa/"
else
    echo "❌ Build directory missing! Run: npm run build"
    exit 1
fi

# Check essential files
echo "📁 Checking essential files..."

if [ -f "dist/spa/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing!"
    exit 1
fi

if [ -f "dist/spa/.htaccess" ]; then
    echo "✅ .htaccess found"
else
    echo "❌ .htaccess missing!"
    exit 1
fi

if [ -d "dist/spa/assets" ]; then
    echo "✅ assets/ folder found"
    asset_count=$(ls -1 dist/spa/assets/ | wc -l)
    echo "   → Contains $asset_count files"
else
    echo "❌ assets/ folder missing!"
    exit 1
fi

echo ""
echo "📊 Build Analysis:"
echo "=================="

# Show file sizes
echo "File sizes:"
if command -v du >/dev/null 2>&1; then
    du -h dist/spa/* 2>/dev/null | sort -hr
else
    ls -lh dist/spa/ 2>/dev/null
fi

echo ""
echo "📦 What's included in your deployment:"
echo "======================================"
echo "🏠 Home page - Landing with hero section"
echo "🚀 Launchpad - AI token generator"
echo "🐑 Lamb Defense - Galaga-style shooter game"
echo "🌿 Barrio's Garden - Mario-style platformer"
echo "🗺️  Roadmap - Project timeline"
echo "📄 Whitepaper - Documentation"
echo "👥 Team - Team information"
echo "💰 Wallet Integration - Solana support"
echo "💨 Gas Token System - Player progression"

echo ""
echo "🎯 DEPLOYMENT READY!"
echo "==================="
echo ""
echo "📤 Next Steps:"
echo "1. Login to GoDaddy hosting account"
echo "2. Open cPanel → File Manager"
echo "3. Go to public_html folder"
echo "4. Delete existing files"
echo "5. Upload ALL files from dist/spa/"
echo "6. Set .htaccess permissions to 644"
echo ""
echo "🌐 Result: Your domain will show the full Lambaaaghini website!"
echo ""
echo "🔗 Pages that will work:"
echo "   • https://yourdomain.com/ (Home)"
echo "   • https://yourdomain.com/launchpad (AI Token Generator)"
echo "   • https://yourdomain.com/game (Lamb Defense Game)"
echo "   • https://yourdomain.com/barrio (Barrio's Garden Game)"
echo "   • https://yourdomain.com/roadmap (Roadmap)"
echo "   • https://yourdomain.com/whitepaper (Whitepaper)"
echo "   • https://yourdomain.com/team (Team)"
echo ""
echo "✨ All features included:"
echo "   • Solana wallet connection"
echo "   • Gas token earning & spending"
echo "   • Status title upgrades"
echo "   • Both games with high scores"
echo "   • Mobile-responsive design"
echo "   • Professional meme aesthetics"
echo ""
echo "🎮 Ready to deploy! Your complete website awaits! 🚀"
