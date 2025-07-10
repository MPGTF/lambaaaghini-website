# 🔧 Vercel "Not Found" Troubleshooting Guide

## 🎯 Common Causes & Solutions

### 1. **Build Configuration Issues** (Most Common)

#### Check Your Vercel Project Settings

1. **Go to Vercel Dashboard** → Your Project → Settings → General
2. **Verify these settings:**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist/spa
Install Command: npm install
Node.js Version: 18.x (or 20.x)
```

#### If Settings Are Wrong:

1. **Update in Vercel Dashboard** → Settings → General
2. **Redeploy** → Deployments → Click "..." → Redeploy

---

### 2. **Build Output Directory Issues**

#### Check Your Local Build

```bash
# Run build locally to verify
npm run build

# Check what's created
ls -la dist/
ls -la dist/spa/

# Should show:
# dist/spa/index.html
# dist/spa/assets/ (folder with CSS/JS)
```

#### If `dist/spa` is Empty or Missing:

Your build might be outputting to wrong location. Check `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    outDir: "dist/spa", // ← Should be this
  },
});
```

---

### 3. **Missing Index.html**

#### Verify Index File Exists

```bash
# Check if index.html exists in build output
cat dist/spa/index.html

# Should show HTML content, not error
```

#### If Missing or Corrupted:

```bash
# Clear build cache and rebuild
rm -rf dist/
rm -rf node_modules/.vite/
npm run build
```

---

### 4. **SPA Routing Issues**

#### Create/Update `vercel.json`

Your React routes need special handling. Create this file in your project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 5. **Environment Variables**

#### Check for Missing Environment Variables

If your app uses environment variables:

1. **Vercel Dashboard** → Settings → Environment Variables
2. **Add any missing variables:**

```
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

### 6. **Deployment Logs**

#### Check Build Logs for Errors

1. **Vercel Dashboard** → Deployments
2. **Click latest deployment**
3. **View Function Logs**
4. **Look for errors in Build phase**

Common error patterns:

- `Module not found`
- `Build failed`
- `Command "npm run build" exited with 1`

---

## 🚀 Quick Fix Steps (Try in Order)

### Step 1: Verify Local Build

```bash
npm run build
ls -la dist/spa/
# Should show index.html and assets/ folder
```

### Step 2: Check Vercel Configuration

1. **Vercel Dashboard** → Project → Settings
2. **Build & Development Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`
   - Install Command: `npm install`

### Step 3: Add vercel.json (if missing)

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 4: Force Redeploy

```bash
# If using GitHub integration
git add .
git commit -m "Fix Vercel deployment"
git push

# Or manual redeploy in Vercel dashboard
```

### Step 5: Check Domain Settings

1. **Vercel Dashboard** → Project → Settings → Domains
2. **Verify your domain is properly configured**
3. **Check DNS propagation** at [whatsmydns.net](https://whatsmydns.net)

---

## 🔍 Detailed Diagnostics

### Check Deployment Status

1. **Vercel Dashboard** → Deployments
2. **Look for failed deployments** (red X)
3. **Click failed deployment** → View logs

### Common Build Errors:

#### Error: `Build failed`

**Solution:** Check package.json scripts

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build"
  }
}
```

#### Error: `Output directory not found`

**Solution:** Update output directory to `dist/spa`

#### Error: `Command exited with 1`

**Solution:** Check for TypeScript errors or missing dependencies

---

## 🎯 Specific Fix for Your Lambaaaghini App

Based on your React SPA with games, here's the exact configuration:

### 1. Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Verify Build Command:

Your `package.json` should have:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build"
  }
}
```

### 3. Correct Vercel Settings:

```
Framework: Vite
Build Command: npm run build
Output Directory: dist/spa
Install Command: npm install
```

---

## 🧪 Test Your Fix

After applying fixes:

1. **Visit your Vercel URL**
2. **Test these routes:**

   - `yourdomain.com/` (should show home)
   - `yourdomain.com/launchpad` (should show launchpad)
   - `yourdomain.com/game` (should show lamb defense)
   - `yourdomain.com/barrio` (should show barrio game)

3. **Check browser console** for any errors

---

## 🆘 If Still Not Working

### Manual Redeploy Steps:

```bash
# 1. Clean everything
rm -rf dist/
rm -rf node_modules/
rm -rf .vercel/

# 2. Fresh install
npm install

# 3. Test build locally
npm run build
npm run preview  # Test if it works locally

# 4. Redeploy
vercel --prod --force
```

### Alternative: Fresh Vercel Project

If all else fails:

1. **Delete current Vercel project**
2. **Create new project** with correct settings
3. **Import your GitHub repo again**

---

## 🔧 Emergency CLI Fix

```bash
# Quick CLI redeploy with correct settings
vercel --prod --build-env VERCEL_PROJECT_ID=your-project-id
```

---

## 📞 Get Specific Help

**To get targeted help, share:**

1. **Your Vercel deployment URL**
2. **Error message from deployment logs**
3. **Contents of your `dist/spa/` folder after build**
4. **Your current vercel.json (if any)**

Most "not found" issues are resolved by fixing the build output directory and adding proper SPA routing with `vercel.json`.

Your Lambaaaghini website with both games should be working perfectly once these configuration issues are resolved! 🐑🚀
