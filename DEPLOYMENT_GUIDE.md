# 🚀 Deployment Guide - Qubic Smart Contract Studio

## Step 1: Deploy Backend to Railway

### A. Sign Up / Login to Railway
1. Go to https://railway.app
2. Sign up with GitHub (recommended)

### B. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `HildaPosada/-Qubic-hackathon`
4. Railway will automatically detect the configuration

### C. Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
ENVIRONMENT=production
MOCK_MODE=false

# Optional (for real Qubic integration)
QUBIC_RPC_URL=https://rpc.qubic.org
QUBIC_WALLET_ADDRESS=your_wallet_address
QUBIC_PRIVATE_KEY=your_private_key

# CORS (Important!)
CORS_ORIGINS=["https://your-frontend-url.vercel.app", "https://qubic-hackathon.vercel.app"]
```

### D. Deploy
1. Railway will automatically build and deploy
2. Wait 2-3 minutes for deployment
3. Copy your deployment URL (e.g., `https://qubic-backend-production.up.railway.app`)

### E. Test Backend
Open in browser:
```
https://your-backend-url.railway.app/docs
```

You should see the FastAPI Swagger UI!

---

## Step 2: Connect Frontend to Real Backend

### A. Update Builder.io Environment Variables

1. Go to your Builder.io project
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update these variables:

```bash
VITE_API_URL=https://your-backend-url.railway.app
VITE_MOCK_MODE=false
```

### B. Redeploy Frontend
1. In Builder.io, click **"Publish"** or **"Deploy"**
2. Wait for deployment to complete

### C. Test Integration
1. Open your frontend: https://qubic-hackathon.vercel.app
2. Try generating a contract
3. Check browser console for API calls
4. Verify it's calling your Railway backend (not mock data)

---

## Step 3: Real Qubic Integration (Optional - Advanced)

### A. Install Qubic SDK in Backend

Add to `backend/requirements.txt`:
```
qubic-sdk==0.1.0  # Check for latest version
```

### B. Update Backend Code

In `backend/app/services/deploy_service.py`:
```python
from qubic_sdk import QubicClient

class DeployService:
    def __init__(self):
        self.qubic_client = QubicClient(
            rpc_url=settings.QUBIC_RPC_URL,
            wallet_address=settings.QUBIC_WALLET_ADDRESS,
            private_key=settings.QUBIC_PRIVATE_KEY
        )

    async def deploy_to_testnet(self, contract_code: str):
        # Real deployment logic
        result = await self.qubic_client.deploy_contract(
            code=contract_code,
            network="testnet"
        )
        return result
```

### C. Configure Qubic Credentials

In Railway, add these environment variables:
```bash
QUBIC_RPC_URL=https://testnet-rpc.qubic.org
QUBIC_WALLET_ADDRESS=your_qubic_wallet_address
QUBIC_PRIVATE_KEY=your_qubic_private_key
```

⚠️ **Security Note:** Never commit private keys to git!

---

## Alternative: Deploy to Render.com

If Railway doesn't work, use Render:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3.11
5. Add environment variables (same as Railway)
6. Click **"Create Web Service"**

---

## Alternative: Deploy to Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create qubic-backend`
4. Add Procfile (already created)
5. Deploy:
   ```bash
   git push heroku main
   ```
6. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set MOCK_MODE=false
   ```

---

## Troubleshooting

### Backend won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure `requirements.txt` is correct

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify `VITE_API_URL` is correct (include `https://`)
- Check browser console for CORS errors

### API returns 500 errors
- Check backend logs in Railway
- Verify `OPENAI_API_KEY` is valid
- Try setting `MOCK_MODE=true` for testing

---

## Quick Deploy Checklist

- [ ] Backend deployed to Railway
- [ ] Environment variables configured
- [ ] Backend URL copied
- [ ] Frontend environment variables updated
- [ ] Frontend redeployed
- [ ] API connection tested
- [ ] Generate contract tested
- [ ] Security audit tested
- [ ] Everything working!

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/

---

**Next Steps After Deployment:**
1. Test all features (Generate, Audit, Deploy)
2. Monitor backend logs for errors
3. Add real Qubic SDK for testnet deployment
4. Set up production database (PostgreSQL on Railway)
5. Enable HTTPS (automatic on Railway/Render)
