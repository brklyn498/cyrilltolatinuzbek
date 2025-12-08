# Deployment Guide

This project is configured for automatic deployment to **GitHub Pages** using GitHub Actions.

## Quick Start: Enabling Deployment

To deploy this application, you need to enable GitHub Actions in your repository settings.

1.  **Open Repository Settings**:
    *   Navigate to your repository on GitHub.
    *   Click on the **Settings** tab (usually the rightmost tab in the top navigation bar).

2.  **Navigate to Pages**:
    *   In the left sidebar menu, scroll down to the "Code and automation" section.
    *   Click on **Pages**.

3.  **Configure Source**:
    *   Find the **Build and deployment** section.
    *   Look for the **Source** dropdown menu (it might default to "Deploy from a branch").
    *   Change the selection to **GitHub Actions**.

4.  **Verify**:
    *   Once you select "GitHub Actions", you don't need to save; GitHub updates the setting immediately.
    *   Go to the **Actions** tab in your repository.
    *   You should see a workflow run titled "Deploy to GitHub Pages" (or similar) start automatically if you have recently pushed code.
    *   If no workflow is running, push a new commit to your `main` or `master` branch to trigger the first deployment.

## How it Works

The deployment workflow is defined in `.github/workflows/deploy.yml`.

*   **Trigger**: The deployment runs automatically whenever you push changes to the `main` or `master` branch.
*   **Process**:
    1.  Checks out your code.
    2.  Installs Node.js and dependencies (`npm ci`).
    3.  Builds the project (`npm run build`).
    4.  Uploads the `dist` folder to GitHub Pages.

## Local Build Verification

Before pushing, you can verify the build locally:

```bash
npm run build
# Preview the production build
npm run preview
```

## Configuration Details

### Vite Configuration
The `vite.config.ts` file is configured with `base: './'` to ensure the app works correctly when deployed to a subdirectory (which is the default for GitHub Pages project sites).

```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  // ...
})
```

### GitHub Actions Workflow
The workflow file `.github/workflows/deploy.yml` handles the build and deploy process. It uses the standard actions `actions/deploy-pages` and `actions/upload-pages-artifact`.
