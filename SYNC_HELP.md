# Sync Troubleshooting Guide

## 🔥 Git Log Issue? Use This First!

If you're experiencing git log hanging or sync issues:

```bash
# Fix all git configuration issues
chmod +x fix-git.sh
./fix-git.sh

# Then use quick sync (no log issues)
chmod +x quick-sync.sh
./quick-sync.sh
```

## Quick Sync Commands

### Option 1: Quick Sync (RECOMMENDED - No log issues)
```bash
chmod +x quick-sync.sh
./quick-sync.sh
```

### Option 2: Full sync script (with logs)
```bash
chmod +x sync.sh
./sync.sh
```

### Option 3: Manual sync
```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Your commit message here"

# Pull latest changes
git pull origin main --rebase

# Push your changes
git push origin main
```

## Common Sync Issues & Solutions

### Issue 0: Git log hangs or freezes (COMMON!)
**Problem:** Running `git log` or sync scripts hang/freeze
**Solution:**
```bash
# Quick fix
chmod +x fix-git.sh
./fix-git.sh

# Then use quick-sync instead
chmod +x quick-sync.sh
./quick-sync.sh
```

**Why it happens:** Git's default pager (less/more) can hang in some terminals

**Alternative manual fix:**
```bash
git config --global core.pager cat
git config --local core.pager cat
```

### Issue 1: "Permission denied" on sync.sh
**Solution:**
```bash
chmod +x sync.sh
```

### Issue 2: Merge conflicts
**Solution:**
```bash
# View conflicted files
git status

# Edit the conflicted files and remove conflict markers (<<<<, ====, >>>>)
# Then:
git add .
git rebase --continue
# or
git merge --continue
```

### Issue 3: "Remote branch ahead" or diverged branches
**Solution:**
```bash
# Fetch latest changes
git fetch origin

# Rebase your changes on top of remote
git pull origin main --rebase

# If there are conflicts, resolve them and continue
git rebase --continue

# Push your changes
git push origin main
```

### Issue 4: "Authentication failed"
**Solution:**
1. Make sure you're logged into GitHub in VS Code
2. Or use GitHub CLI:
```bash
gh auth login
```
3. Or configure Git credentials:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Issue 5: Want to undo last commit (not pushed yet)
**Solution:**
```bash
# Keep changes but undo commit
git reset --soft HEAD~1

# Discard changes and undo commit
git reset --hard HEAD~1
```

### Issue 6: Already pushed but want to undo
**Solution:**
```bash
# Create a new commit that reverses the changes
git revert HEAD
git push origin main
```

### Issue 7: .env file causing issues
**Solution:**
The .env file is intentionally ignored (it's in .gitignore). This is correct for security.
If you need to share environment variables, use .env.example (which is tracked).

## Files Changed in Recent Updates

The following files were modified and need to be synced:
- `frontend/vite.config.ts` - Fixed API proxy for Docker
- `frontend/src/components/Editor.tsx` - Added Save button functionality
- `frontend/src/components/Header.tsx` - Added Connect Wallet functionality
- `BUTTON_FUNCTIONALITY.md` - Documentation (new file)
- `sync.sh` - This sync script (new file)

## Check What Will Be Synced

Before syncing, check what files changed:
```bash
git status
```

To see detailed changes:
```bash
git diff
```

To see changes in a specific file:
```bash
git diff frontend/vite.config.ts
```

## Force Sync (Use with caution!)

If you're absolutely sure you want to overwrite remote with local:
```bash
git push origin main --force
```

⚠️ **WARNING**: This will overwrite remote history. Only use if you're the only one working on the branch!

## Need Help?

If you're still having issues, please share:
1. The exact error message
2. Output of `git status`
3. What you're trying to do

Common error keywords to watch for:
- "conflict" → Need to resolve merge conflicts
- "diverged" → Branches have different histories
- "rejected" → Remote has changes you don't have locally
- "authentication" → Login/credentials issue
