# 📋 Add These Secrets to GitHub

## Go to: https://github.com/shashiv367/backend/settings/secrets/actions

Click **"New repository secret"** for each one below:

---

## Secret 1: SERVER_HOST

**Name:** `SERVER_HOST`  
**Value:** 
```
192.168.1.80
```

---

## Secret 2: SSH_USERNAME

**Name:** `SSH_USERNAME`  
**Value:**
```
grahmindubuntu
```

---

## Secret 3: DEPLOY_PATH

**Name:** `DEPLOY_PATH`  
**Value:**
```
/home/grahmindubuntu/backend/app
```

---

## Secret 4: SSH_PRIVATE_KEY

**Name:** `SSH_PRIVATE_KEY`  
**Value:** (Copy the ENTIRE block below, including BEGIN and END lines)

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACC+9YYWI2t0nd+bjIioKz9h6fkzOwwe+ZOOHRHSAy+yXgAAAJDAnXKFwJ1y
hQAAAAtzc2gtZWQyNTUxOQAAACC+9YYWI2t0nd+bjIioKz9h6fkzOwwe+ZOOHRHSAy+yXg
AAAEAcKhMHxWljlsvckmqJa6oHvohW2vaTiLE9jJhQne8Ghr71hhYja3Sd35uMiKgrP2Hp
+TM7DB75k44dEdIDL7JeAAAADXNoYXNoaUBTSEFTSEk=
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **IMPORTANT:** 
- Copy ALL lines including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`
- Include all the blank lines
- The key should be exactly as shown above

---

## Secret 5: SSH_PORT (Optional)

**Name:** `SSH_PORT`  
**Value:**
```
22
```

*(Only add this if you're using a non-standard SSH port)*

---

## ✅ Quick Checklist

After adding all secrets, verify:

- [ ] SERVER_HOST = `192.168.1.80`
- [ ] SSH_USERNAME = `grahmindubuntu`
- [ ] DEPLOY_PATH = `/home/grahmindubuntu/backend/app`
- [ ] SSH_PRIVATE_KEY = Full key with BEGIN/END markers (all 6 lines)
- [ ] All secrets are set to "Repository secrets" (not environment secrets)

---

## 🚀 Test the Deployment

Once all secrets are added:

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
   - Click on it to see the deployment progress
   - Green checkmark = Success ✅
   - Red X = Failed (check logs) ❌

---

## 🔍 Verify Server Setup

Before deploying, make sure on your server:

1. **Git repository exists at the deploy path:**
   ```bash
   ssh grahmindubuntu@192.168.1.80
   cd /home/grahmindubuntu/backend/app
   git remote -v  # Should show your GitHub repo
   ```

2. **Docker is installed:**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **User has Docker permissions:**
   ```bash
   # If you get permission denied, add user to docker group:
   sudo usermod -aG docker grahmindubuntu
   # Then logout and login again
   ```

4. **Public key is in authorized_keys:**
   ```bash
   # Make sure your PUBLIC key is in:
   cat ~/.ssh/authorized_keys
   ```

---

## 🐛 Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs:**
   - Go to Actions tab → Click on failed workflow → Check error messages

2. **Common errors:**

   **"Permission denied (publickey)":**
   - Make sure your PUBLIC key (not private) is in `~/.ssh/authorized_keys` on server
   - Test SSH manually: `ssh grahmindubuntu@192.168.1.80`

   **"fatal: not a git repository":**
   - Make sure `/home/grahmindubuntu/backend/app` is a git repository
   - Initialize if needed: `cd /home/grahmindubuntu/backend/app && git init && git remote add origin https://github.com/shashiv367/backend.git`

   **"docker-compose: command not found":**
   - Install docker-compose or use `docker compose` (newer versions)
   - Or update workflow to use `docker compose` instead

   **"Cannot connect to Docker daemon":**
   - Add user to docker group: `sudo usermod -aG docker grahmindubuntu`
   - Logout and login again

---

## 📝 Notes

- The SSH_PRIVATE_KEY must include the BEGIN and END markers
- Make sure there are no extra spaces or line breaks when pasting
- The DEPLOY_PATH should point to where your git repository is cloned
- If your structure is different, adjust DEPLOY_PATH accordingly

---

## ✅ Ready to Deploy!

Once all 4 secrets are added to GitHub, push to main branch and watch it deploy automatically! 🚀



