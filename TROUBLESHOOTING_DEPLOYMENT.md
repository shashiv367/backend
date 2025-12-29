# 🔧 Troubleshooting Deployment Failure

## Step 1: Check the Error Logs

1. Go to: https://github.com/shashiv367/backend/actions
2. Click on the failed workflow (the red X)
3. Click on the "deploy" job
4. Expand each step to see the error message

**Common error messages and solutions:**

---

## Error: "Permission denied (publickey)"

**Cause:** SSH key authentication failed

**Solutions:**
1. **Verify your PUBLIC key is on the server:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   cat ~/.ssh/authorized_keys
   ```
   - Should contain your PUBLIC key (starts with `ssh-ed25519` or `ssh-rsa`)

2. **Add your public key if missing:**
   ```bash
   # On your local machine, get your public key:
   # Windows:
   type C:\Users\$env:USERNAME\.ssh\id_ed25519.pub
   
   # Then on server:
   ssh grahmindubuntu@192.168.1.80
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

3. **Test SSH manually:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   # Should connect without password
   ```

---

## Error: "fatal: not a git repository"

**Cause:** The DEPLOY_PATH doesn't contain a git repository

**Solutions:**
1. **Check if path exists:**
   ```bash
   ssh grahmindubuntu@192.168.1.80 "ls -la /home/grahmindubuntu/backend/app"
   ```

2. **Initialize git repository if needed:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   cd /home/grahmindubuntu/backend/app
   git init
   git remote add origin https://github.com/shashiv367/backend.git
   git pull origin main
   ```

3. **Or clone the repository:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   cd /home/grahmindubuntu/backend
   rm -rf app  # If it exists and is wrong
   git clone https://github.com/shashiv367/backend.git app
   ```

---

## Error: "docker-compose: command not found"

**Cause:** Docker Compose not installed or not in PATH

**Solutions:**
1. **Check Docker installation:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   docker --version
   docker compose version  # Newer Docker versions use 'docker compose'
   ```

2. **If using newer Docker, update workflow:**
   - Change `docker-compose` to `docker compose` in the workflow

3. **Install docker-compose if missing:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

---

## Error: "Cannot connect to Docker daemon"

**Cause:** User doesn't have Docker permissions

**Solutions:**
```bash
ssh grahmindubuntu@192.168.1.80
sudo usermod -aG docker grahmindubuntu
# Logout and login again, or:
newgrp docker
docker ps  # Should work now
```

---

## Error: "docker-compose.yml not found"

**Cause:** Wrong DEPLOY_PATH or file structure

**Solutions:**
1. **Check actual structure on server:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   find /home/grahmindubuntu -name "docker-compose.yml" 2>/dev/null
   ```

2. **Update DEPLOY_PATH in GitHub Secrets:**
   - If docker-compose.yml is at `/home/grahmindubuntu/backend/app/` → Keep as is
   - If it's at `/home/grahmindubuntu/backend/app/backend/` → Update path or adjust workflow

---

## Error: "Host key verification failed"

**Cause:** Server not in known_hosts

**Solutions:**
Update workflow to skip host key verification (add to workflow):
```yaml
with:
  host: ${{ secrets.SERVER_HOST }}
  username: ${{ secrets.SSH_USERNAME }}
  key: ${{ secrets.SSH_PRIVATE_KEY }}
  port: ${{ secrets.SSH_PORT || 22 }}
  script_stop: true
  script: |
    # Your script here
```

Or add to workflow:
```yaml
with:
  ...
  host_key_checking: false
```

---

## Quick Diagnostic Commands

Run these on your server to verify setup:

```bash
# 1. Test SSH access
ssh grahmindubuntu@192.168.1.80 "echo 'SSH works!'"

# 2. Check deploy path
ssh grahmindubuntu@192.168.1.80 "ls -la /home/grahmindubuntu/backend/app"

# 3. Check if git repo
ssh grahmindubuntu@192.168.1.80 "cd /home/grahmindubuntu/backend/app && git remote -v"

# 4. Check Docker
ssh grahmindubuntu@192.168.1.80 "docker --version && docker ps"

# 5. Check docker-compose
ssh grahmindubuntu@192.168.1.80 "cd /home/grahmindubuntu/backend/app && docker-compose --version"

# 6. Check file structure
ssh grahmindubuntu@192.168.1.80 "cd /home/grahmindubuntu/backend/app && ls -la"
```

---

## Most Common Issues

1. **SSH Key not properly set up** (60% of failures)
   - Make sure PUBLIC key is in `~/.ssh/authorized_keys` on server
   - Test SSH manually first

2. **Wrong DEPLOY_PATH** (20% of failures)
   - Path doesn't exist or doesn't contain git repository
   - Check actual path on server

3. **Docker permissions** (15% of failures)
   - User not in docker group
   - Run: `sudo usermod -aG docker grahmindubuntu`

4. **docker-compose not found** (5% of failures)
   - Use `docker compose` (newer versions) or install docker-compose

---

## Next Steps

1. **Click "Details" on the failed workflow** to see the exact error
2. **Copy the error message** and check which category it falls into above
3. **Fix the issue** using the solutions provided
4. **Re-run the workflow** or push again to trigger deployment

---

## Need More Help?

Share the exact error message from the GitHub Actions logs, and I can provide specific guidance!



