# Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment

- [ ] Code is committed and pushed to GitHub/GitLab/Bitbucket
- [ ] All tests pass locally
- [ ] Production build works: `npm run build`
- [ ] You have a Gemini API key ready
- [ ] You have a Render account

## Initial Setup

- [ ] Create new Web Service in Render
- [ ] Connect your Git repository
- [ ] Configure service settings:
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Region: Choose closest to users

## Environment Variables

Set these in Render Dashboard → Environment:

### Required
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `GEMINI_API_KEY` = `your_actual_api_key`

### Update After First Deploy
- [ ] `ALLOWED_ORIGINS` = `https://your-app.onrender.com`

### Optional (with defaults)
- [ ] `DATABASE_PATH` = `/data/bbs.db`
- [ ] `LOG_LEVEL` = `INFO`

## Persistent Storage

- [ ] Add disk in Render Dashboard → Disks:
  - [ ] Name: `data`
  - [ ] Mount Path: `/data`
  - [ ] Size: 1 GB minimum

## First Deployment

- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Note your app URL (e.g., https://the-dead-net.onrender.com)

## Post-Deployment Configuration

- [ ] Update `ALLOWED_ORIGINS` with actual app URL
- [ ] Save changes (triggers redeployment)
- [ ] Wait for redeployment to complete

## Verification

- [ ] Visit app URL - should load the frontend
- [ ] Check health endpoint: `https://your-app.onrender.com/health`
- [ ] Test user login
- [ ] Create a test board
- [ ] Post a message
- [ ] Check Render logs for errors

## Monitoring

- [ ] Review application logs in Render Dashboard
- [ ] Check metrics (CPU, memory, requests)
- [ ] Set up uptime monitoring (optional)

## Security

- [ ] Verify HTTPS is enabled (automatic on Render)
- [ ] Confirm CORS settings are correct
- [ ] Review CSP headers in server logs
- [ ] Run `npm audit` and fix vulnerabilities

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure DNS for custom domain
- [ ] Set up automatic deployments on push
- [ ] Add health check monitoring
- [ ] Configure alerts for errors/downtime
- [ ] Implement database backup strategy
- [ ] Add rate limiting if needed
- [ ] Set up monitoring (e.g., Sentry, LogRocket)

## Troubleshooting

If deployment fails, check:

- [ ] Build logs for errors
- [ ] All dependencies in package.json
- [ ] Environment variables are set correctly
- [ ] Persistent disk is mounted
- [ ] Database path is correct
- [ ] KIRO_API_KEY is valid

## Common Issues

### Build Fails
- Check TypeScript compilation errors
- Verify all imports are correct
- Ensure dependencies are installed

### Runtime Errors
- Check Render logs
- Verify environment variables
- Confirm database initialization
- Test KIRO API key validity

### CORS Errors
- Update ALLOWED_ORIGINS
- Include https:// protocol
- Match exact URL from Render

### WebSocket Issues
- Verify Socket.IO configuration
- Check client connection URL
- Review CORS settings for WebSockets

## Success Criteria

✅ App loads at Render URL
✅ Health endpoint returns 200 OK
✅ Can log in successfully
✅ Can create and view boards
✅ Can post messages
✅ No errors in logs
✅ WebSocket connections work

## Next Steps After Successful Deployment

1. Share app URL with team
2. Monitor initial usage
3. Set up production monitoring
4. Plan for scaling if needed
5. Document any custom configurations
6. Set up automated backups
7. Create runbook for common issues

---

**Deployment Date**: ___________
**App URL**: ___________
**Deployed By**: ___________
**Notes**: ___________
