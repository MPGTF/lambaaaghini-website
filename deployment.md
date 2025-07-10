# 🚀 Lambaaaghini Deployment Guide

## GoDaddy Shared Hosting Deployment (Recommended for Static Sites)

### Prerequisites

- GoDaddy hosting account with cPanel access
- FTP client (FileZilla) or cPanel File Manager access
- Your domain pointing to GoDaddy hosting

### Step 1: Build the Application

```bash
# Make the deploy script executable (Mac/Linux)
chmod +x deploy.sh

# Run the deployment build
./deploy.sh

# OR manually build
npm run build
```

### Step 2: Access GoDaddy cPanel

1. Login to your GoDaddy account
2. Go to "My Products" → "Web Hosting"
3. Click "Manage" next to your hosting plan
4. Click "cPanel Admin"

### Step 3: Upload Files

**Using cPanel File Manager:**

1. Open "File Manager" in cPanel
2. Navigate to `public_html` folder
3. **Delete existing files** (index.html, etc.)
4. Click "Upload"
5. Upload ALL files from `dist/spa/` folder
6. If you uploaded a ZIP, extract it

**Using FTP (Alternative):**

1. Get FTP credentials from GoDaddy
2. Use FileZilla or similar FTP client
3. Upload contents of `dist/spa/` to `public_html/`

### Step 4: Configure Domain & SSL

1. In GoDaddy, ensure domain points to hosting
2. Enable SSL certificate (free with GoDaddy hosting)
3. Force HTTPS redirects (required for Solana wallets)

## File Structure After Upload

```
public_html/
├── index.html (your main page)
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other static files]
```

## Alternative: GoDaddy Domain + Netlify Hosting (Best Performance)

### Why This Approach?

- ✅ Faster global CDN
- ✅ Automatic HTTPS
- ✅ Easy Git deployments
- ✅ Better Solana wallet support

### Steps:

1. **Deploy to Netlify:**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Build and deploy
   npm run build
   netlify deploy --prod --dir=dist/spa
   ```

2. **Configure GoDaddy DNS:**

   - Go to GoDaddy DNS Management
   - Add A Record: `@` → Netlify IP
   - Add CNAME: `www` → your-app.netlify.app

3. **Configure Custom Domain in Netlify:**
   - Add your domain in Netlify dashboard
   - Follow SSL setup instructions

## Troubleshooting

### Common Issues:

1. **Blank page after upload:**

   - Check if all files uploaded correctly
   - Ensure index.html is in root of public_html

2. **Wallet connection fails:**

   - Ensure HTTPS is enabled
   - Check browser console for errors

3. **Routes not working (404 errors):**

   - Add .htaccess file for React Router support

4. **Assets not loading:**
   - Check file paths and permissions
   - Ensure assets folder uploaded completely

### Support Files Needed:

- SSL certificate enabled
- .htaccess for React Router (see below)

## Additional Configuration Files

### .htaccess for React Router

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages accessible (Home, Launchpad, etc.)
- [ ] Solana wallet connection works
- [ ] HTTPS enabled and working
- [ ] Mobile responsive design working
- [ ] All images and assets loading

## Support

If you encounter issues:

1. Check GoDaddy hosting logs
2. Review browser console for errors
3. Verify all files uploaded correctly
4. Contact GoDaddy support for hosting-specific issues
