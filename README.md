# debtbox-admin

## Deployment to GitHub Pages

This project can be deployed to GitHub Pages using either automated GitHub Actions or manual deployment.

### Automated Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Push to main branch:**
   - The workflow will automatically trigger on push to `main`
   - You can also manually trigger it from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your deployed site:**
   - After deployment, your site will be available at:
     `https://<your-username>.github.io/<repository-name>/`
   - Or if you have a custom domain configured, it will use that

### Custom Domain Setup (admin.debtbox.sa)

To configure the custom domain `admin.debtbox.sa`:

1. **CNAME file is already created** in `public/CNAME` (will be automatically included in builds)

2. **Add DNS CNAME record** at your DNS provider:
   - **Type:** CNAME
   - **Name:** `admin`
   - **Value:** `<your-org-or-username>.github.io` (e.g., `debtbox.github.io`)
   - **TTL:** 3600 (or default)

3. **Configure in GitHub:**
   - Go to **Settings** → **Pages** → **Custom domain**
   - Enter: `admin.debtbox.sa`
   - Wait for DNS verification (can take a few minutes to hours)

**⚠️ Troubleshooting DNS errors?** See [DNS_SETUP.md](./DNS_SETUP.md) for detailed instructions and troubleshooting.

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the project
pnpm run build

# Deploy to GitHub Pages
pnpm run deploy
```

**Note:** Make sure you have the `gh-pages` package installed (already in devDependencies) and have push access to the repository.

### Configuration

- The build output directory is `dist/`
- The base path in `vite.config.ts` is set to `/debtbox-admin/` for GitHub Pages subdirectory deployment
- **When custom domain (admin.debtbox.sa) is configured and working**, update the base path:
  - In `vite.config.ts`: Change `base` to `'/'` or set `VITE_BASE_PATH='/'` environment variable
  - The app will automatically use the correct base path via `VITE_BASE_PATH` environment variable

### Branch Configuration

If your default branch is not `main`, update the workflow file:
- Edit `.github/workflows/deploy.yml`
- Change `branches: - main` to your branch name (e.g., `master`)
