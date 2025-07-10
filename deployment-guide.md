# GoDaddy Deployment Guide for Lambaaaghini App

## Prerequisites

- GoDaddy domain with hosting plan
- FTP/cPanel access to your GoDaddy hosting

## Method 1: Using cPanel File Manager (Recommended)

### Step 1: Access cPanel

1. Log into your GoDaddy account
2. Go to "My Products" → "Web Hosting"
3. Click "Manage" next to your hosting plan
4. Click "cPanel Admin"

### Step 2: Upload Files

1. In cPanel, find "File Manager" and click it
2. Navigate to `public_html` folder (this is your domain root)
3. **Important**: Delete any existing files in public_html (like default GoDaddy pages)
4. Upload all files from the `dist/spa/` folder to `public_html`:
   - `index.html`
   - `assets/` folder (contains all CSS/JS files)
   - `.htaccess` file

### Step 3: Set Permissions

1. Right-click on `.htaccess` file → Permissions
2. Set permissions to 644

## Method 2: Using FTP

### Step 1: Get FTP Credentials

1. In your GoDaddy hosting dashboard
2. Find FTP settings/credentials
3. Note down: FTP server, username, password

### Step 2: Upload via FTP Client

1. Use FileZilla, WinSCP, or similar FTP client
2. Connect to your GoDaddy FTP server
3. Navigate to `public_html` folder
4. Upload all files from `dist/spa/` to `public_html`

## Important Files to Upload

```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-*.css
    ├── index-*.js
    └── (other asset files)
```

## Post-Deployment Steps

### 1. Test Your Site

- Visit your domain (e.g., `https://yourdomain.com`)
- Test navigation between pages (Home, Launchpad, Games, etc.)
- Verify wallet connection works
- Test both games functionality

### 2. Check HTTPS

- Ensure your site loads with HTTPS
- If not, enable SSL in GoDaddy hosting settings

### 3. Domain Configuration

If deploying to a subdomain (e.g., `app.yourdomain.com`):

1. Create subdomain in GoDaddy DNS settings
2. Point subdomain to your hosting
3. Upload files to the subdomain folder

## Troubleshooting

### 404 Errors on Page Refresh

- Ensure `.htaccess` file is uploaded and has correct permissions
- Check that URL rewriting is enabled in your hosting plan

### Assets Not Loading

- Verify all files in `assets/` folder are uploaded
- Check file permissions (should be 644 for files, 755 for folders)

### Wallet Issues

- Ensure you're accessing via HTTPS
- Solana wallet adapters require secure connection

### Large File Size Warning

The build shows some large chunks. For better performance:

- Enable GZip compression (included in .htaccess)
- Consider upgrading to a better GoDaddy hosting plan if loading is slow

## File Structure Check

After upload, your public_html should look like:

```
public_html/
├── index.html (≈ 0.4 KB)
├── .htaccess
└── assets/
    ├── index-vokomwAY.css (≈ 83 KB)
    ├── index-Bqe4kxxa.js (≈ 16 KB)
    ├── index-DTtREsyl.js (≈ 33 KB)
    ├── TransportWebHID-B1EF_Sy-.js (≈ 36 KB)
    └── index-BmgJY4eV.js (≈ 1.3 MB)
```

## Performance Tips

1. **Enable CDN**: Consider using GoDaddy's CDN if available
2. **Optimize Images**: The app uses emoji and external images, ensure they load quickly
3. **Monitor Loading**: The main JS bundle is large (1.3MB), monitor site speed
4. **Caching**: The .htaccess includes aggressive caching for static assets

## DNS Settings (if using custom domain)

If pointing a domain to GoDaddy hosting:

1. A Record: `@` → Your GoDaddy hosting IP
2. CNAME: `www` → `yourdomain.com`

## SSL Certificate

GoDaddy usually provides free SSL:

1. In hosting dashboard, find "SSL Certificates"
2. Enable/install SSL certificate
3. The .htaccess will force HTTPS redirects

## Support

If you encounter issues:

1. Check GoDaddy hosting error logs
2. Verify all files uploaded correctly
3. Ensure hosting plan supports .htaccess and URL rewriting
4. Contact GoDaddy support if domain/hosting issues persist

Your Lambaaaghini app should now be live at your domain! 🐑🚀
