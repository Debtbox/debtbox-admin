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
- The base path in `vite.config.ts` is set to `/` for GitHub Pages
- If deploying to a subdirectory, update the `base` path in `vite.config.ts`

### Branch Configuration

If your default branch is not `main`, update the workflow file:
- Edit `.github/workflows/deploy.yml`
- Change `branches: - main` to your branch name (e.g., `master`)
