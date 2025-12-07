#!/bin/bash

# Push Hugging Face Updates

echo "🤗 Pushing Hugging Face updates..."
echo ""

# Stage all changes
git add -A

# Commit
git commit -m "Add: Hugging Face AI support (FREE forever!)" --no-verify --allow-empty

# Push
git push origin $(git rev-parse --abbrev-ref HEAD)

echo ""
echo "✅ Pushed successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Get your Hugging Face token:"
echo "   https://huggingface.co/settings/tokens"
echo ""
echo "2. Add to Railway environment variables:"
echo "   HUGGINGFACE_API_KEY=hf_your_token_here"
echo "   AI_PROVIDER=huggingface"
echo "   AI_MODEL=bigcode/starcoder"
echo "   MOCK_MODE=false"
echo ""
echo "3. Railway will auto-deploy!"
echo ""
echo "🎉 FREE AI contract generation ready!"
