# 🚀 Lambaaaghini Deployment Checklist

## Pre-Deployment

- [ ] Run `npm run build` successfully
- [ ] Test the built app locally (serve dist/spa folder)
- [ ] Verify all pages load correctly
- [ ] Check Solana wallet connection works
- [ ] Ensure all images and assets are included

## GoDaddy Shared Hosting Steps

### 1. Build Your App

```bash
npm run build
```

### 2. Prepare Files

- Navigate to `dist/spa/` folder
- This contains your deployable files
- You'll upload ALL these files to GoDaddy

### 3. Access GoDaddy cPanel

1. Login to GoDaddy account
2. Go to "My Products" → "Web Hosting" → "Manage"
3. Click "cPanel Admin"

### 4. Upload to public_html

1. Open "File Manager" in cPanel
2. Navigate to `public_html` folder
3. **Delete any existing files** (especially index.html)
4. Upload ALL files from your `dist/spa/` folder
5. If you uploaded as ZIP, extract it

### 5. Upload .htaccess

- Upload the `.htaccess` file from `public/` folder to `public_html/`
- This ensures React Router works correctly

## Post-Deployment Verification

### Check These URLs Work:

- [ ] https://yourdomain.com (homepage)
- [ ] https://yourdomain.com/launchpad (AI token creator)
- [ ] https://yourdomain.com/roadmap (roadmap page)
- [ ] https://yourdomain.com/whitepaper (whitepaper page)
- [ ] https://yourdomain.com/team (team page)

### Test Functionality:

- [ ] Navigation works between pages
- [ ] Solana wallet connection button appears
- [ ] AI token creation form loads
- [ ] Mobile responsive design works
- [ ] All images and styling load correctly

## Alternative: Netlify Deployment (Recommended)

### Why Netlify?

- Faster global CDN
- Automatic HTTPS
- Easy updates via Git
- Better performance for Solana dApps

### Quick Netlify Deploy:

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**

   ```bash
   npm run build
   netlify deploy --prod --dir=dist/spa
   ```

3. **Configure Custom Domain:**
   - Add your GoDaddy domain in Netlify dashboard
   - Update GoDaddy DNS to point to Netlify

## Troubleshooting

### Common Issues:

**Blank Page:**

- Check if index.html is in root of public_html
- Verify all assets uploaded correctly

**404 Errors on Routes:**

- Ensure .htaccess file is uploaded
- Check that React Router redirects are working

**Wallet Won't Connect:**

- Verify HTTPS is enabled
- Check browser console for errors
- Ensure no mixed content warnings

**Slow Loading:**

- Enable Gzip compression in cPanel
- Optimize images before upload
- Consider using Netlify/Vercel for better performance

## Security Checklist

- [ ] HTTPS enabled and working
- [ ] SSL certificate active
- [ ] No mixed content warnings
- [ ] Security headers configured (.htaccess)
- [ ] Force HTTPS redirects working

## Final Steps

1. **Test from different devices/browsers**
2. **Share the live link with others for testing**
3. **Monitor for any errors or issues**
4. **Set up domain email if needed**
5. **Configure analytics if desired**

## Support

If deployment fails:

1. Check GoDaddy hosting status
2. Review error logs in cPanel
3. Contact GoDaddy support for hosting issues
4. Check this checklist for missed steps

## Success! 🎉

Your Lambaaaghini Solana launchpad is now live and ready for users to create AI-powered tokens!
