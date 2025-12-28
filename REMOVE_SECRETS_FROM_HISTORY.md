# Remove Secrets from Git History

GitHub is blocking your push because secrets were committed in a previous commit. Here are your options:

## Option 1: Allow Secrets (If Test Credentials)

If these are **test credentials** that you don't mind exposing:

1. Click these links from the error message:
   - Google OAuth Client ID: https://github.com/abhijithof/petra-pet-finder/security/secret-scanning/unblock-secret/37UaM8agp1WvfWfT0e5S5Xzt8nI
   - Google OAuth Client Secret: https://github.com/abhijithof/petra-pet-finder/security/secret-scanning/unblock-secret/37UaM6M33UHmk7JTZ4BcwU9N8wc

2. Click "Allow secret" on each page
3. Push again: `git push`

## Option 2: Remove Secrets from History

If you want to remove secrets from git history:

### Using git filter-repo (Recommended)

```bash
# Install git-filter-repo if needed
# brew install git-filter-repo  # macOS

# Remove secrets from history
git filter-repo --path VERCEL_ENV_SETUP.md --invert-paths
git filter-repo --path-glob '*.md' --replace-text <(echo '388769718271-6vcmterf7796qsugik6uvnq14a9g3bi8==>YOUR_GOOGLE_CLIENT_ID')
git filter-repo --path-glob '*.md' --replace-text <(echo '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==>YOUR_GOOGLE_CLIENT_SECRET')
git filter-repo --path-glob '*.md' --replace-text <(echo 'rzp_test_RwhMCCFHXXL6pY==>YOUR_RAZORPAY_KEY_ID')
git filter-repo --path-glob '*.md' --replace-text <(echo '3rehRaiQxsRM23KFbLfIcaBx==>YOUR_RAZORPAY_SECRET')

# Force push (WARNING: This rewrites history)
git push --force
```

### Using BFG Repo-Cleaner (Alternative)

```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/

# Create a file with secrets to remove
echo "388769718271-6vcmterf7796qsugik6uvnq14a9g3bi8" > secrets.txt
echo "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" >> secrets.txt
echo "rzp_test_RwhMCCFHXXL6pY" >> secrets.txt
echo "3rehRaiQxsRM23KFbLfIcaBx" >> secrets.txt

# Remove secrets
java -jar bfg.jar --replace-text secrets.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

## Option 3: Create New Branch (Safest)

If you don't want to rewrite history:

```bash
# Create a new branch without the problematic commits
git checkout -b main-clean
git rebase --onto main-clean efaaa7f ef4d611
# Then merge or replace main branch
```

## Recommendation

Since these appear to be **test credentials** (test Razorpay keys, etc.), **Option 1 is the fastest** - just allow them in GitHub and push again.

For production, make sure to:
- ✅ Use different credentials for production
- ✅ Never commit production secrets
- ✅ Use environment variables only
- ✅ Add `.env.local` to `.gitignore` (already done)

