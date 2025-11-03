# Deployment Guide - Render

This guide will help you deploy Vibe Kanban to Render, a cloud hosting platform.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- A Kiro API key (get one from [https://kiro.ai](https://kiro.ai))
- This repository pushed to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Connect Your Repository

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Select the repository containing this project

### 2. Configure Your Service

Use these settings when creating your web service:

- **Name**: `vibe-kanban` (or your preferred name)
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your default branch)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or choose a paid plan for better performance)

### 3. Set Environment Variables

In the Render dashboard, go to **Environment** section and add these variables:

**Required:**
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render's default)
- `KIRO_API_KEY` = `your_actual_kiro_api_key`

**Important:**
- `ALLOWED_ORIGINS` = Your app URL (e.g., `https://vibe-kanban.onrender.com`)
  - **Note**: Update this AFTER your first deployment when you know your app URL

**Optional (defaults provided):**
- `KIRO_API_URL` = `https://api.kiro.ai/v1`
- `KIRO_TIMEOUT` = `30000`
- `DATABASE_PATH` = `/data/kanban.db`
- `LOG_LEVEL` = `INFO`

### 4. Add Persistent Disk for Database

Since this app uses SQLite, you need persistent storage:

1. In your service settings, go to **Disks**
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `data`
   - **Mount Path**: `/data`
   - **Size**: `1 GB` (should be sufficient)
4. Click **"Create Disk"**

### 5. Deploy!

1. Click **"Create Web Service"**
2. Render will automatically deploy your app
3. Wait for the build to complete (usually 2-5 minutes)
4. Your app will be available at `https://your-service-name.onrender.com`

### 6. Post-Deployment Configuration

After your first deployment:

1. Copy your app URL (e.g., `https://vibe-kanban.onrender.com`)
2. Go back to **Environment** settings
3. Update `ALLOWED_ORIGINS` with your actual app URL
4. Save changes (this will trigger a redeployment)

## Using render.yaml (Alternative Method)

If you prefer Infrastructure as Code, you can use the included `render.yaml` file:

1. In Render Dashboard, click **"New +"** → **"Blueprint"**
2. Connect your repository
3. Render will automatically detect `render.yaml`
4. Review the configuration
5. Set the required environment variables in the dashboard
6. Click **"Apply"**

**Note**: You'll still need to add the persistent disk manually via the dashboard.

## Verifying Deployment

After deployment, verify everything works:

1. Visit your app URL
2. Check the health endpoint: `https://your-app.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`
3. Try logging in and creating a board
4. Check the logs in Render Dashboard for any errors

## Troubleshooting

### Build Failures

**Problem**: Build fails during `npm run build`
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally

**Problem**: "Module not found" errors
- Make sure all imports use correct paths
- Check that all required files are committed to Git

### Runtime Errors

**Problem**: "Database initialization failed"
- Verify persistent disk is mounted at `/data`
- Check `DATABASE_PATH` environment variable
- Review server logs for specific errors

**Problem**: "KIRO_API_KEY required"
- Ensure `KIRO_API_KEY` is set in environment variables
- Verify the API key is valid

**Problem**: CORS errors in browser
- Update `ALLOWED_ORIGINS` to include your Render app URL
- Make sure to include the protocol (`https://`)

### WebSocket Issues

**Problem**: WebSocket connections fail
- Render supports WebSockets by default
- Verify your frontend is connecting to the correct URL
- Check that Socket.IO is properly configured in both client and server

### Performance Issues (Free Tier)

The free tier on Render has some limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Limited resources (512 MB RAM, shared CPU)

**Solutions**:
- Upgrade to a paid plan for always-on services
- Use a service like UptimeRobot to keep your app alive
- Optimize your application for cold starts

## Monitoring

### Logs

View logs in real-time:
1. Go to your service in Render Dashboard
2. Click on **"Logs"** tab
3. Monitor for errors or warnings

### Metrics

Render provides basic metrics:
- CPU usage
- Memory usage
- Request counts
- Response times

Access these in the **"Metrics"** tab of your service.

## Updating Your Deployment

Render automatically deploys when you push to your connected branch:

1. Make changes locally
2. Commit and push to your repository
3. Render detects the push and starts a new deployment
4. Monitor the deployment in the Render dashboard

### Manual Deployment

You can also trigger manual deployments:
1. Go to your service in Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Database Backups

Your SQLite database is stored on the persistent disk. To backup:

1. Use Render's disk snapshot feature (paid plans only)
2. Or implement a backup script that exports data periodically
3. Consider migrating to PostgreSQL for production use

## Security Checklist

Before going to production:

- [ ] Set a strong `KIRO_API_KEY`
- [ ] Configure `ALLOWED_ORIGINS` correctly
- [ ] Enable HTTPS (Render does this automatically)
- [ ] Review Content Security Policy in `server.cjs`
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated (`npm audit`)

## Cost Estimates

### Free Tier
- 750 hours/month free
- Services spin down after 15 min inactivity
- 1 GB disk free

### Starter Plan ($7/month)
- Always-on service
- Better performance
- No spin-down
- Up to 10 GB disk

## Support and Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Vibe Kanban Issues](https://github.com/your-repo/issues)

## Next Steps

After successful deployment:

1. Set up a custom domain (optional)
2. Configure SSL certificate (automatic with custom domain)
3. Set up monitoring and alerts
4. Plan for scaling if needed
5. Consider database backups strategy
6. Implement CI/CD pipeline improvements

---

**Need help?** Check the Render documentation or open an issue in the repository.
