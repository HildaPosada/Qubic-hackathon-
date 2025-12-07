#!/bin/bash
# One-line sync - No questions asked!

git config --global core.pager cat && \
git config --global --add safe.directory "$(pwd)" && \
git add . && \
git commit -m "Update: Button functionality and API configuration" --no-verify --allow-empty && \
git push origin $(git rev-parse --abbrev-ref HEAD) && \
echo "✅ Synced successfully!"
