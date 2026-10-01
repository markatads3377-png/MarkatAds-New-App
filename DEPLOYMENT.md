# Mark@Ads - Cloudflare & GitHub Deployment Troubleshooting & Fix Guide

## ⚠️ Why Did the GitHub Action Fail after 11 seconds?

If you see **"All checks have failed: Deploy Mark@Ads to Cloudflare Pages / Build & Deploy to Cloudflare Pages (push) - Failing after 11s"**, it happens because of one of two reasons:

1. **Missing Cloudflare Secrets in GitHub (Most Common):**
   The `.github/workflows/deploy.yml` workflow looks for `${{ secrets.CLOUDFLARE_API_TOKEN }}` and `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`. If those secrets have not been added to your GitHub repository yet, GitHub terminates the job immediately with an authentication error.

2. **Missing `package-lock.json` & Peer Dependency Collision:**
   When running `npm install`, modern npm can enforce strict peer checks. We have resolved this by:
   - Creating a complete `package-lock.json`
   - Aligning `esbuild` to `^0.27.0`
   - Adding `.npmrc` with `legacy-peer-deps=true`
   - Adding a safety check in `.github/workflows/deploy.yml` so it builds cleanly without crashing if secrets are not yet added.

---

## 🚀 How to Fix (Choose Option 1 or Option 2)

### Option 1: Native Cloudflare Pages Git Connect (Easiest - 0 Secrets Needed!)
You **do not need GitHub Actions secrets** if you connect Cloudflare Pages directly to your GitHub repository:

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository `Mark-Ads-WebApp-1-10`.
4. In **Build Settings**:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**.
6. Done! Cloudflare will now deploy automatically on every `git push` without needing any GitHub secrets.

---

### Option 2: Using the GitHub Actions Workflow (With Secrets)

If you prefer using the GitHub Actions workflow in `.github/workflows/deploy.yml`:

1. **Get your Cloudflare API Token & Account ID:**
   - In Cloudflare, go to **My Profile** > **API Tokens** > **Create Token**.
   - Select the **Cloudflare Pages** template (or give `Cloudflare Pages: Edit` permissions).
   - Copy the generated API Token.
   - Go to your Cloudflare Dashboard and copy your **Account ID** (found on the right sidebar of Workers & Pages).
2. **Add the Secrets to GitHub:**
   - Go to your repository `Mark-Ads-WebApp-1-10` on GitHub.
   - Click **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
   - Add Secret 1:
     - Name: `CLOUDFLARE_API_TOKEN`
     - Value: `<paste your Cloudflare API Token>`
   - Add Secret 2:
     - Name: `CLOUDFLARE_ACCOUNT_ID`
     - Value: `<paste your Cloudflare Account ID>`
3. **Re-run the Job or Push a New Commit:**
   - In GitHub, go to the **Actions** tab.
   - Click on the failed workflow > **Re-run all jobs**.
   - It will now pass with green checkmarks!

---

## 🌐 Custom Domain Setup (`www.markatads.com` or your own domain)

Once Cloudflare Pages has finished deploying your site:

1. Go to your Cloudflare project (`markatads`).
2. Click **Custom domains** tab > **Set up a custom domain**.
3. Enter your domain (e.g. `www.markatads.com`).
4. If your domain's DNS is managed on Cloudflare, it will automatically route the CNAME for you with 1-click.
5. If managed on GoDaddy, Namecheap, etc., add:
   - **Type:** `CNAME`
   - **Name:** `www` (or `@`)
   - **Value:** `markatads.pages.dev`
   - **Proxy:** Proxied (Orange cloud on Cloudflare)
