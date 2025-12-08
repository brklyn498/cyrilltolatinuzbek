# Deployment Guide

This project is configured for automatic deployment to **GitHub Pages** using GitHub Actions.

## Prerequisites

1.  **GitHub Repository**: Ensure this project is hosted on GitHub.
2.  **Permissions**: Go to your repository **Settings** > **Pages**.
    *   Under **Build and deployment** > **Source**, select **GitHub Actions**.

## Automatic Deployment

The deployment workflow is defined in `.github/workflows/deploy.yml`.

*   **Trigger**: The deployment runs automatically whenever you push changes to the `main` or `master` branch.
*   **Manual Trigger**: You can also manually trigger the workflow from the **Actions** tab on GitHub.

## Local Build Verification

Before pushing, you can verify the build locally:

```bash
npm run build
# Preview the production build
npm run preview
```

## Configuration

The `vite.config.ts` file has been updated with `base: './'` to ensure the app works correctly when deployed to a subdirectory (which is the default for GitHub Pages project sites).

```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  // ...
})
```
