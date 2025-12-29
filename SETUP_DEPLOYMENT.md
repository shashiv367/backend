# Quick Setup Guide for Automatic Deployment

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your SSH Key

**If you already have an SSH key:**
```bash
# Windows PowerShell:
type C:\Users\$env:USERNAME\.ssh\id_rsa

# Or generate a new one:
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)
```

**Copy the ENTIRE output** (starts with `-----BEGIN OPENSSH PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----`)

### Step 2: Add Public Key to Server

**Copy your PUBLIC key:**
```bash
# Windows PowerShell:
type C:\Users\$env:USERNAME\.ssh\id_rsa.pub
```

**On your server (192.168.1.80), run:**
```bash
# SSH into server first
ssh user@192.168.1.80

# Then add the public key:
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your PUBLIC key, save and exit (Ctrl+X, Y, Enter)

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Add GitHub Secrets

Go to: https://github.com/shashiv367/backend/settings/secrets/actions

Click **"New repository secret"** and add:

| Secret Name | Value | Example |
|------------|-------|---------|
| `SERVER_HOST` | Your server IP | `192.168.1.80` |
| `SSH_USERNAME` | Your SSH username | `root` or `ubuntu` |
| `SSH_PRIVATE_KEY` | Your private key (full content) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `DEPLOY_PATH` | Path where project is on server | `/root/server` or `/home/user/server` |

**Important:** 
- `SSH_PRIVATE_KEY` should be the **ENTIRE** private key content (all lines)
- `DEPLOY_PATH` should be the directory containing your `backend` folder

### Step 4: Test It!

```bash
cd backend
git add .
git commit -m "Setup automatic deployment"
git push origin main
```

Then check: https://github.com/shashiv367/backend/actions

## ✅ Verification Checklist

- [ ] SSH key generated and public key added to server
- [ ] All 4 secrets added to GitHub
- [ ] Can SSH into server manually: `ssh user@192.168.1.80`
- [ ] Project exists at DEPLOY_PATH on server
- [ ] Docker and docker-compose installed on server
- [ ] Pushed to main branch and checked Actions tab

## 🐛 Common Issues

**"Permission denied (publickey)"**
- Make sure you added the PUBLIC key to server's `~/.ssh/authorized_keys`
- Check file permissions: `chmod 600 ~/.ssh/authorized_keys`

**"Host key verification failed"**
- Add server to known_hosts or use `-o StrictHostKeyChecking=no` in workflow

**"docker-compose: command not found"**
- Install docker-compose on server or use `docker compose` (without hyphen)

**"fatal: not a git repository"**
- Make sure DEPLOY_PATH points to the directory with `.git` folder
- Or initialize git: `cd /path && git init && git remote add origin https://github.com/shashiv367/backend.git`

## 📍 Find Your Deploy Path

On your server, find where your project is:
```bash
# If you cloned the repo:
find ~ -name "backend" -type d 2>/dev/null

# Or check common locations:
ls -la /root/
ls -la /home/*/
ls -la /var/www/
```

The DEPLOY_PATH should be the **parent directory** that contains the `backend` folder.

For example:
- If your structure is: `/root/server/backend/` → DEPLOY_PATH = `/root/server`
- If your structure is: `/home/user/myapp/backend/` → DEPLOY_PATH = `/home/user/myapp`



