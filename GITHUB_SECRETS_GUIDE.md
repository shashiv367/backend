# GitHub Secrets Configuration

## ✅ Your Configuration

Based on your information, here's what you need to add to GitHub Secrets:

### Go to: https://github.com/shashiv367/backend/settings/secrets/actions

---

## Secret 1: SERVER_HOST

**Name:** `SERVER_HOST`  
**Value:** `192.168.1.80`

---

## Secret 2: SSH_USERNAME

**Name:** `SSH_USERNAME`  
**Value:** `grahmindubuntu`

---

## Secret 3: DEPLOY_PATH

**Name:** `DEPLOY_PATH`  
**Value:** `/home/grahmindubuntu/backend/app`

**Note:** Make sure this path exists on your server and contains your `backend` folder or is the backend folder itself.

---

## Secret 4: SSH_PRIVATE_KEY

**Name:** `SSH_PRIVATE_KEY`  
**Value:** (See below - IMPORTANT FORMAT)

### ⚠️ Important: SSH Key Format

Your SSH key needs to be in the correct format. An ed25519 key should look like this:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACC+9YYWI2t0nd+bjIioKz9h6fkzOwwe+ZOOHRHSAy+yXgAAAJDAnXKFwJ1y
hQAAAAtzc2gtZWQyNTUxOQAAACC+9YYWI2t0nd+bjIioKz9h6fkzOwwe+ZOOHRHSAy+yXg
AAAEAcKhMHxWljlsvckmqJa6oHvohW2vaTiLE9jJhQne8Ghr71hhYja3Sd35uMiKgrP2Hp
+TM7DB75k44dEdIDL7JeAAAADXNoYXNoaUBTSEFTSEk=
-----END OPENSSH PRIVATE KEY-----
```

### How to Get Your Full Private Key:

**On Windows (PowerShell):**
```powershell
type C:\Users\$env:USERNAME\.ssh\id_ed25519
```

**On Linux/Mac:**
```bash
cat ~/.ssh/id_ed25519
```

**Copy the ENTIRE output** including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the base64 content (multiple lines)
- `-----END OPENSSH PRIVATE KEY-----`

---

## Secret 5: SSH_PORT (Optional)

**Name:** `SSH_PORT`  
**Value:** `22` (default, only add if using different port)

---

## 📋 Quick Checklist

- [ ] SERVER_HOST = `192.168.1.80`
- [ ] SSH_USERNAME = `grahmindubuntu`
- [ ] DEPLOY_PATH = `/home/grahmindubuntu/backend/app`
- [ ] SSH_PRIVATE_KEY = Full key with BEGIN/END markers
- [ ] SSH_PORT = `22` (optional)

---

## 🔍 Verify Your Setup

### 1. Test SSH Connection Locally:
```bash
ssh grahmindubuntu@192.168.1.80
```

### 2. Verify Deploy Path Exists:
```bash
ssh grahmindubuntu@192.168.1.80 "ls -la /home/grahmindubuntu/backend/app"
```

### 3. Check if Git Repo Exists:
```bash
ssh grahmindubuntu@192.168.1.80 "cd /home/grahmindubuntu/backend/app && git remote -v"
```

### 4. Verify Docker:
```bash
ssh grahmindubuntu@192.168.1.80 "docker --version && docker-compose --version"
```

---

## 🚀 After Adding Secrets

1. **Push your changes:**
   ```bash
   cd backend
   git add .
   git commit -m "Setup automatic deployment"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/shashiv367/backend/actions
   - You should see a workflow running
   - Click on it to see deployment progress

---

## ⚠️ Important Notes

1. **SSH Key Format:** Make sure your private key includes the BEGIN and END markers
2. **Deploy Path:** The path should point to where your git repository is cloned
3. **Permissions:** Make sure the user `grahmindubuntu` has:
   - Read/write access to the deploy path
   - Docker permissions (might need to add to docker group: `sudo usermod -aG docker grahmindubuntu`)
4. **Git Repository:** The deploy path should be a git repository (has `.git` folder)

---

## 🐛 Troubleshooting

### If deployment fails with "Permission denied":
- Make sure your PUBLIC key is in `~/.ssh/authorized_keys` on the server
- Check permissions: `chmod 600 ~/.ssh/authorized_keys`

### If "docker-compose: command not found":
- Try using `docker compose` (without hyphen) - newer Docker versions
- Or install docker-compose separately

### If "fatal: not a git repository":
- Make sure `/home/grahmindubuntu/backend/app` is a git repository
- Or initialize it: `cd /home/grahmindubuntu/backend/app && git init && git remote add origin https://github.com/shashiv367/backend.git`

