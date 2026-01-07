# How to push your existing project to GitHub

Follow these steps in your terminal, from the root directory of your project, to publish your code to your new GitHub repository.

### Step 1: Initialize Git and make your first commit
If you haven't done so already.

```bash
git init -b main
git add .
git commit -m "Initial commit"
```

### Step 2: Link to your GitHub repository and push
This connects your local project to the empty repository you created on GitHub and uploads your files.

```bash
# Set the remote origin to your GitHub repository URL
git remote add origin https://github.com/monkeyDluffitaro/loan-disbursal-system.git

# Push your 'main' branch to the remote origin
git push -u origin main
```
