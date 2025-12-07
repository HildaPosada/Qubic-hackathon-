# Railway Deployment Configuration

## Environment Variables Required

Set these in your Railway project dashboard:

```bash
ENVIRONMENT=production
DEBUG=False
MOCK_MODE=true
PORT=8000

# Optional - for real AI features
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here

# CORS will accept all origins by default
# If you want to restrict, update backend/app/utils/config.py
```

## Deploy Options

### Option 1: Automatic Deploy (Recommended)
Railway will auto-detect the configuration from:
- `railway.toml`
- `nixpacks.toml`
- `backend/requirements.txt`

### Option 2: Manual Start Command
If automatic detection fails, set this as the start command in Railway:

```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
```

### Option 3: Using Dockerfile
If you prefer Docker, use this start command:

```bash
docker build -f Dockerfile.backend -t backend . && docker run -p $PORT:8000 backend
```

## Troubleshooting

### Issue: Module not found errors
**Fix:** Make sure `backend` directory is at root level and Railway is starting from root

### Issue: Port binding errors
**Fix:** Railway automatically provides PORT env variable, make sure you're using it

### Issue: CORS errors
**Fix:** Already configured to allow all origins. Check backend logs for details

### Issue: Build fails
**Fix:** Check Railway build logs and ensure all dependencies in requirements.txt are valid

## Testing Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/health

# API docs
https://your-app.up.railway.app/docs

# Root endpoint
curl https://your-app.up.railway.app/
```

## Required Files for Railway

✅ railway.toml - Railway configuration
✅ nixpacks.toml - Build configuration
✅ backend/requirements.txt - Python dependencies
✅ backend/app/main.py - FastAPI app
✅ start.sh - Start script (optional)
✅ install.sh - Install script (optional)

All files are now properly configured! 🚀
