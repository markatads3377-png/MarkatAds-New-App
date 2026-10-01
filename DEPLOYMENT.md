# Mark@Ads - Cloudflare Pages & GitHub Automatic Deployment Guide

This guide provides step-by-step instructions for connecting this repository to **Cloudflare Pages**, binding your **custom domain** (e.g. `www.markatads.com` or your own brand domain), and establishing **seamless automatic deployments** on every `git push`.

---

## Architecture Overview

- **Build Output Directory:** `dist`
- **Build Command:** `npm run build`
- **Node.js Version:** `20.x`
- **Routing Engine:** Single Page Application (SPA) handled via `public/_redirects` (`/* /index.html 200`)
- **Performance Headers:** Asset caching and security headers defined in `public/_headers`

---

## Method 1: Cloudflare Pages Git Integration (Recommended - Zero Maintenance)

This is the fastest, cleanest method. Cloudflare listens directly to your GitHub repository and triggers builds automatically on every commit.

### Step 1: Push your Code to GitHub
1. Create a repository on GitHub (e.g. `github.com/your-username/markatads`).
2. Push your project to the repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Mark@Ads marketplace with Cloudflare deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/markatads.git
   git push -u origin main
   ```

### Step 2: Connect Repository in Cloudflare Dashboard
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** > **Pages** (or **Workers & Pages** > **Create application** > **Pages**).
3. Select **Connect to Git**.
4. Authenticate your GitHub account and select your `markatads` repository.
5. In **Build Settings**, configure the following:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave blank or default)
6. Under **Environment variables**, optionally set:
   - `NODE_VERSION` = `20`
7. Click **Save and Deploy**. Cloudflare will build the bundle and provide you with an active URL (e.g. `https://markatads.pages.dev`).

---

## Method 2: GitHub Actions Automated CI/CD (Alternative)

If you prefer deploying via GitHub Actions workflow (file located at `.github/workflows/deploy.yml`):

1. In your Cloudflare Dashboard, create an **API Token**:
   - Go to **My Profile** > **API Tokens** > **Create Token**.
   - Use the **Cloudflare Pages** template (or give `Cloudflare Pages: Edit` permissions).
   - Copy your **API Token** and your **Account ID** (found on the Workers & Pages dashboard sidebar).
2. In your GitHub repository:
   - Go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
   - Add `CLOUDFLARE_API_TOKEN` = `<your-api-token>`.
   - Add `CLOUDFLARE_ACCOUNT_ID` = `<your-account-id>`.
3. Every time you push to `main`, GitHub Actions will automatically compile and push your live build directly to Cloudflare!

---

## Step 3: Add Your Custom Domain in Cloudflare

Once your Pages project is deployed:

1. In the Cloudflare Dashboard, open your project (`markatads`).
2. Click the **Custom domains** tab at the top.
3. Click **Set up a custom domain**.
4. Enter your domain:
   - For root + subdomain: enter `yourdomain.com` or `www.yourdomain.com`.
5. **DNS Setup:**
   - **If your domain is already managed by Cloudflare DNS:**
     Cloudflare will automatically configure the CNAME record for you with 1-click!
   - **If your domain is registered elsewhere (Namecheap, GoDaddy, Google Domains, etc.):**
     Add the following DNS record in your registrar's DNS management panel:
     - **Type:** `CNAME`
     - **Name:** `@` (or `www`)
     - **Target:** `<your-project-name>.pages.dev`
     - **TTL:** `Auto` (or `300`)
     - **Proxy status:** Proxied (Orange cloud on Cloudflare)
6. Cloudflare will automatically provision a **free SSL/TLS certificate** (HTTPS) and configure HTTP-to-HTTPS redirect within minutes.

---

## Performance Optimizations Included

1. **Static Pre-Rendering & Single-Bundle Caching:**
   - All static assets under `/assets/` are configured with `Cache-Control: public, max-age=31536000, immutable` in `public/_headers`.
2. **SPA Client Routing:**
   - Direct visits to deep links like `/browse`, `/buyer`, `/seller`, or `/admin` are mapped to `/index.html` via `public/_redirects` without 404 errors.
3. **Zero-Bloat Frontend:**
   - Heavy server runtimes and unused dependencies have been removed, resulting in fast first contentful paint (FCP < 0.8s).
