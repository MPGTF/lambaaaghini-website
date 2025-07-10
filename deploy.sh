#!/bin/bash

echo "🐑 Lambaaaghini Deployment Script 🚀"
echo "====================================="

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create .htaccess if it doesn't exist
echo "📋 Creating .htaccess file..."
cat > dist/spa/.htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router (SPA) routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Set cache headers for static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

echo "✅ Build complete!"
echo ""
echo "📁 Files ready for upload in: dist/spa/"
echo ""
echo "📤 Next steps:"
echo "1. Access your GoDaddy cPanel File Manager"
echo "2. Navigate to public_html folder"
echo "3. Delete existing files"
echo "4. Upload ALL files from dist/spa/ folder"
echo "5. Ensure .htaccess file is uploaded"
echo ""
echo "🌐 Your site will be live at your domain!"
echo "🎮 Test both games and wallet functionality"
echo ""
echo "📋 File sizes:"
ls -lh dist/spa/

echo ""
echo "🚀 Ready for deployment!"
