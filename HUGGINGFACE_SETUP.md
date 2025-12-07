# 🤗 Hugging Face Setup Guide (FREE Forever!)

## Step 1: Get Your API Token

Since you already have a Hugging Face account:

1. Go to: https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name it: `qubic-contract-studio`
4. Type: **Read** (that's all you need!)
5. Click **"Generate token"**
6. **Copy the token** (starts with `hf_...`)

---

## Step 2: Add Token to Railway

### In Railway Dashboard:

1. Go to your project
2. Click **"Variables"** tab
3. Add these environment variables:

```bash
# Hugging Face Configuration
HUGGINGFACE_API_KEY=hf_your_token_here
AI_PROVIDER=huggingface
AI_MODEL=bigcode/starcoder
MOCK_MODE=false

# Keep these
ENVIRONMENT=production
DEBUG=False
```

---

## Step 3: Deploy!

The code is already updated! Just push:

```bash
chmod +x push-hf-update.sh && ./push-hf-update.sh
```

Railway will auto-deploy with Hugging Face AI! 🚀

---

## 🎯 Recommended FREE Models

### For Code Generation (Best):

| Model | Quality | Speed | Notes |
|-------|---------|-------|-------|
| `bigcode/starcoder` | ⭐⭐⭐⭐ | Fast | **RECOMMENDED** - Best for code |
| `codellama/CodeLlama-13b-hf` | ⭐⭐⭐⭐⭐ | Medium | Excellent quality |
| `WizardLM/WizardCoder-15B-V1.0` | ⭐⭐⭐⭐ | Fast | Great for C++ |

### For General (Backup):

| Model | Quality | Speed |
|-------|---------|-------|
| `mistralai/Mistral-7B-Instruct-v0.2` | ⭐⭐⭐ | Fast |
| `meta-llama/Llama-2-13b-hf` | ⭐⭐⭐⭐ | Medium |

---

## 🧪 Test Locally First

```bash
# Set environment variable
export HUGGINGFACE_API_KEY=hf_your_token_here
export AI_PROVIDER=huggingface
export MOCK_MODE=false

# Test backend
cd backend
uvicorn app.main:app --reload --port 8000

# Test in browser
http://localhost:8000/docs
```

Try the `/api/generate` endpoint!

---

## 💰 Cost: $0.00 (FREE Forever!)

✅ Hugging Face Inference API is FREE  
✅ No credit card required  
✅ Unlimited requests (with rate limits)  
✅ Perfect for hackathons and demos  

### Rate Limits:
- ~100 requests per hour (FREE tier)
- More than enough for your demo!

---

## 🔄 Switch Between Providers

You can easily switch:

### Use Hugging Face (FREE):
```bash
AI_PROVIDER=huggingface
AI_MODEL=bigcode/starcoder
```

### Use Mock Mode:
```bash
AI_PROVIDER=mock
MOCK_MODE=true
```

### Use OpenAI (if you get credits):
```bash
AI_PROVIDER=openai
AI_MODEL=gpt-3.5-turbo
OPENAI_API_KEY=sk-your-key
```

---

## ⚠️ Troubleshooting

### Error: "Model not found"
**Fix:** Use one of the recommended models above

### Error: "Token invalid"
**Fix:** Generate a new token at https://huggingface.co/settings/tokens

### Error: "Rate limit exceeded"
**Fix:** Wait a few minutes or use Mock Mode temporarily

### Error: "Slow responses"
**Fix:** Normal for FREE tier! Responses take 5-30 seconds

---

## 🎉 You're All Set!

1. ✅ Get your HF token
2. ✅ Add to Railway variables
3. ✅ Push code changes
4. ✅ Deploy!

**AI contract generation for FREE!** 🚀
