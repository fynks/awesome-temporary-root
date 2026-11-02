# Temp Root Checker Deployment Documentation

## 1. Cloudflare Pages Direct Upload Project
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages).
2. Create a new project: **Connect to Git** -> **GitHub** -> **fynks/awesome-temporary-root**.
3. Select branch: **main** (production) or **arena/b7a0b610-awesome-temporary-root** (preview).
4. Project Name: **temp-root-checker**.
5. Build settings:
   - Build command: `npm ci && npm run build`
   - Build output directory: `dist/`

## 2. GitHub Secrets
Add the following secrets in the repository settings (`Settings > Secrets and variables > Actions`):
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
- `CLOUDFLARE_API_TOKEN`: A token with "Zone:Edit" and "Pages:Edit" permissions for the project.

## 3. Production Branch
- The production branch is **main**.
- Deployment triggers on push to **main** after CI passes.

## 4. Local Build
```bash
npm ci
npm run data:validate
npm run data:generate
npm run build
```
The output will be in `dist/`.

## 5. Trigger Deployment
- Push to **main** triggers the CI/CD pipeline.
- Preview deployments are available for pull requests.

## 6. Diagnose Failed Deployment
- Check GitHub Actions logs in the repository.
- Ensure `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are correct.
- Verify the build command `npm run build` completes successfully and produces `dist/`.
