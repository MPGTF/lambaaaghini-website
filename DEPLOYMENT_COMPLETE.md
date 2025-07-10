# Complete GoDaddy Deployment Guide - Lambaaaghini Website

## 🚀 What You're Deploying

Your complete React SPA includes:

- **Home Page** - Landing page with hero section
- **Launchpad** - AI token generator with pump.fun integration
- **Lamb Defense** - Galaga-style shooter game with gas tokens
- **Barrio's Garden** - Mario-style platformer game
- **Roadmap** - Project timeline
- **Whitepaper** - Project documentation
- **Team** - Team information
- **Wallet Integration** - Full Solana wallet support
- **Gas Token System** - Player progression with silly titles

## 📋 Pre-Deployment Checklist

### Step 1: Verify Your Build

Run these commands to ensure everything is ready:

```bash
# Build the production version
npm run build

# Check that build completed successfully
ls -la dist/spa/
```

Your `dist/spa/` folder should contain:

- `index.html`
- `assets/` folder with CSS and JS files
- `.htaccess` file (for routing)

### Step 2: GoDaddy Hosting Requirements

✅ **Hosting Plan**: Shared hosting or higher
✅ **SSL Certificate**: Free SSL (usually included)
✅ **File Manager Access**: cPanel or FTP access
✅ **Domain**: Your existing GoDaddy domain

## 🌐 Method 1: cPanel Upload (Recommended)

### Step 1: Access Your GoDaddy Hosting

1. **Login to GoDaddy Account**

   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account

2. **Access Hosting Dashboard**

   - Go to "My Products"
   - Find "Web Hosting" section
   - Click "Manage" next to your hosting plan

3. **Open cPanel**
   - Look for "cPanel Admin" button
   - Click to open cPanel interface

### Step 2: Prepare Your Domain Root

1. **Open File Manager**

   - In cPanel, find "File Manager" icon
   - Click to open

2. **Navigate to Domain Root**

   - Go to `public_html` folder
   - This is where your website files go

3. **Clean Existing Files** ��️ IMPORTANT
   - Select ALL existing files in public_html
   - Delete default GoDaddy pages (like "index.html", "cgi-bin", etc.)
   - Keep ONLY: `.htaccess` (if it exists) and any other important files you want to preserve

### Step 3: Upload Your Website

1. **Upload All Files**

   - Click "Upload" button in File Manager
   - Select ALL files from your `dist/spa/` folder:
     - `index.html`
     - `assets/` folder (entire folder)
     - `.htaccess` file

2. **Verify Upload**
   Your `public_html` should now contain:

   ```
   public_html/
   ├── index.html
   ├── .htaccess
   └── assets/
       ├── index-*.css
       ├── index-*.js
       └── (other asset files)
   ```

3. **Set Permissions**
   - Right-click on `.htaccess` file
   - Set permissions to 644
   - Ensure all folders have 755 permissions

## 🔧 Method 2: FTP Upload

### Step 1: Get FTP Credentials

1. **In GoDaddy Hosting Dashboard**
   - Look for "FTP" or "FTP Accounts"
   - Note your FTP server, username, password

### Step 2: Connect via FTP Client

1. **Use FTP Client** (FileZilla, WinSCP, etc.)

   - Server: Your GoDaddy FTP server
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (usually default)

2. **Upload Files**
   - Navigate to `public_html` folder
   - Upload ALL files from `dist/spa/`

## 🔗 Domain Configuration

### For Main Domain (yourdomain.com)

If deploying to your main domain root:

- Upload files directly to `public_html/`
- Your site will be live at `https://yourdomain.com`

### For Subdomain (app.yourdomain.com)

If you want to use a subdomain:

1. **Create Subdomain in GoDaddy**

   - In hosting dashboard, find "Subdomains"
   - Create new subdomain (e.g., "app")
   - It will create folder like `public_html/app/`

2. **Upload to Subdomain Folder**
   - Upload files to `public_html/app/` instead
   - Site will be live at `https://app.yourdomain.com`

## 🔒 SSL/HTTPS Setup

### Enable SSL Certificate

1. **In GoDaddy Hosting Dashboard**

   - Look for "SSL Certificates"
   - Enable free SSL certificate
   - Wait for SSL to activate (can take up to 24 hours)

2. **Force HTTPS** (Done automatically via .htaccess)
   - The .htaccess file includes HTTPS redirect
   - All traffic will automatically redirect to HTTPS

## 🧪 Testing Your Deployment

### 1. Basic Site Test

- Visit your domain: `https://yourdomain.com`
- Should see Lambaaaghini homepage

### 2. Navigation Test

Test all navigation links:

- ✅ Home (`/`)
- ✅ Launchpad (`/launchpad`)
- ✅ Lamb Defense (`/game`)
- ✅ Barrio's Garden (`/barrio`)
- ✅ Roadmap (`/roadmap`)
- ✅ Whitepaper (`/whitepaper`)
- ✅ Team (`/team`)

### 3. Functionality Test

- ✅ Wallet connection works
- ✅ Both games load and play
- ✅ Gas token system functions
- ✅ All buttons and interactions work
- ✅ External links work (Twitter, Fartbook)

### 4. Mobile Test

- ✅ Site works on mobile devices
- ✅ Touch controls work in games
- ✅ Responsive design functions

## 🐛 Troubleshooting

### Problem: 404 Errors on Page Refresh

**Solution:**

- Ensure `.htaccess` file is uploaded
- Check .htaccess permissions (should be 644)
- Verify hosting plan supports URL rewriting

### Problem: CSS/JS Files Not Loading

**Solution:**

- Verify `assets/` folder uploaded completely
- Check file permissions (644 for files, 755 for folders)
- Clear browser cache

### Problem: Wallet Connection Issues

**Solution:**

- Ensure site loads via HTTPS
- Check SSL certificate is active
- Solana wallets require secure connection

### Problem: Slow Loading

**Solution:**

- Enable GZip compression (included in .htaccess)
- Consider upgrading GoDaddy hosting plan
- Main JS bundle is 1.3MB - this is normal for React apps

## 📊 Performance Optimization

### Built-in Optimizations (Already Included)

✅ **Asset Caching** - 1 year cache for static files
✅ **GZip Compression** - Smaller file transfers
✅ **HTTPS Redirect** - Security and SEO
✅ **SPA Routing** - All React Router routes work

### Optional Improvements

- **CDN**: Enable GoDaddy CDN if available
- **Image Optimization**: Optimize any custom images
- **Hosting Upgrade**: Consider VPS for better performance

## 📁 Final File Structure

After successful deployment, your hosting should look like:

```
public_html/
├── index.html (0.41 kB)
├── .htaccess
└── assets/
    ├── index-vokomwAY.css (83.25 kB)
    ├── index-Bqe4kxxa.js (15.89 kB)
    ├── index-DTtREsyl.js (32.57 kB)
    ├── TransportWebHID-B1EF_Sy-.js (35.50 kB)
    └── index-BmgJY4eV.js (1,328.61 kB)
```

## 🎯 Success Indicators

Your deployment is successful when:

✅ **Main site loads** at your domain
✅ **All navigation works** without 404 errors
✅ **Wallet connection** functions properly
✅ **Both games work** (Lamb Defense & Barrio's Garden)
✅ **Gas token system** saves progress
✅ **Mobile responsive** on all devices
✅ **HTTPS enabled** with green lock icon

## 📞 Support Resources

If you encounter issues:

1. **GoDaddy Support**: Contact for hosting/domain issues
2. **Check Browser Console**: F12 → Console for errors
3. **Test Different Browsers**: Ensure compatibility
4. **Clear Cache**: Hard refresh with Ctrl+F5

Your complete Lambaaaghini website with all features will be live at your GoDaddy domain! 🐑🚀

---

## Quick Commands Summary

```bash
# Build your app
npm run build

# Verify build contents
ls -la dist/spa/

# Your files to upload:
# - All contents of dist/spa/ folder
# - Upload to public_html/ on GoDaddy
# - Ensure .htaccess is included
```

**Domain Result**: `https://yourdomain.com` → Full Lambaaaghini experience!
