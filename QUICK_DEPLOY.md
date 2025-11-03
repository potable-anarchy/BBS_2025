# Quick Deploy to Render - TL;DR

Fast track guide for deploying Vibe Kanban to Render.

## Prerequisites
- Render account
- Kiro API key
- Code pushed to Git

## 5-Minute Deploy

### 1. Create Service (2 min)
```
Render Dashboard → New + → Web Service
→ Connect your repo
→ Select this repository
```

### 2. Configure (1 min)
```
Name: vibe-kanban
Runtime: Node
Build: npm install && npm run build
Start: npm start
Plan: Free
```

### 3. Set Variables (1 min)
```
NODE_ENV = production
PORT = 10000
KIRO_API_KEY = your_key_here
```

### 4. Deploy (1 min)
```
Click "Create Web Service"
Wait for build...
```

### 5. Add Disk & Update CORS
```
Settings → Disks → Add Disk
  Name: data
  Path: /data
  Size: 1GB

Environment → ALLOWED_ORIGINS
  Value: https://your-app.onrender.com
  Save (redeploys)
```

## Verify

```bash
# Should return {"status":"ok","timestamp":"..."}
curl https://your-app.onrender.com/health
```

## Done! 🎉

Visit: `https://your-app.onrender.com`

## Troubleshooting

**Build fails?** Check logs in Render Dashboard
**500 errors?** Verify KIRO_API_KEY is set
**CORS errors?** Update ALLOWED_ORIGINS with your URL

## Full Documentation

- Complete guide: `DEPLOYMENT.md`
- Step-by-step checklist: `RENDER_CHECKLIST.md`
- Technical details: `DEPLOYMENT_SUMMARY.md`
