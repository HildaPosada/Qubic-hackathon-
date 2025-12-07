# 🔄 Git Sync Scripts - Quick Reference

## Your Problem: "Divergent Branches"

**Error:** `fatal: Need to specify how to reconcile divergent branches`

**What it means:** Your local code and GitHub have different changes that need to be merged.

---

## 🎯 SOLUTION (Run These Commands):

### Option 1: Complete Sync (RECOMMENDED)
Handles everything automatically including divergent branches:

```bash
chmod +x complete-sync.sh
./complete-sync.sh
```

**This will:**
- Configure git properly
- Commit your local changes
- Merge remote changes
- Push everything back
- ✅ **Solves divergent branches automatically!**

---

### Option 2: Manual Fix

```bash
# Step 1: Configure git
git config pull.rebase false

# Step 2: Add and commit your changes
git add .
git commit -m "Update: Button functionality and API config"

# Step 3: Pull and merge
git pull origin main --no-edit

# Step 4: Push
git push origin main
```

---

### Option 3: Emergency Fix (If nothing else works)

```bash
chmod +x emergency-sync.sh
./emergency-sync.sh
```

⚠️ **Warning:** This includes a force push option. Only use if you're sure!

---

## 📋 All Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `complete-sync.sh` | ✅ Complete sync with divergent branch handling | **Use this first!** |
| `fix-diverged.sh` | Fix divergent branches only | When you get the divergent error |
| `quick-sync.sh` | Fast sync (no divergence handling) | When branches are in sync |
| `fix-git.sh` | Fix git configuration | Git log hangs or config issues |
| `emergency-sync.sh` | Force sync everything | Last resort only |
| `sync-now.sh` | One-line instant sync | Quick commits |

---

## 🔍 What Caused This?

Your local repository has commits that aren't on GitHub, AND GitHub has commits you don't have locally. Git needs to know how to merge them.

**Your local changes:**
- `vite.config.ts` - API proxy fix
- `Editor.tsx` - Save button
- `Header.tsx` - Connect wallet
- New documentation files

**Remote changes:**
- Something was pushed to GitHub that you don't have

**Solution:** Merge them together (what `complete-sync.sh` does)

---

## ✅ Recommended Action NOW:

```bash
chmod +x complete-sync.sh && ./complete-sync.sh
```

This single command will fix everything and sync your code! 🚀
