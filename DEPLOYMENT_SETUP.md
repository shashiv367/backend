# Automatic Deployment Setup Guide

## ✅ What I've Created

I've set up GitHub Actions for automatic deployment. When you push to the `main` branch, it will automatically deploy to your server at `192.168.1.80:5000`.

## 📋 Setup Steps

### Step 1: Add GitHub Secrets

You need to add these secrets to your GitHub repository:

1. Go to your repository: https://github.com/shashiv367/backend
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these:

#### Required Secrets:

1. **SERVER_HOST**
   - Value: `192.168.1.80`
   - This is your server IP address

2. **SSH_USERNAME**
   - Value: Your SSH username (e.g., `root`, `ubuntu`, `admin`, or your username)
   - The user that can SSH into your server

3. **SSH_PRIVATE_KEY**
   - Value: Your private SSH key content
   - How to get it:
     ```bash
     # On your local machine, if you have SSH key:
     cat ~/.ssh/id_rsa
     # Or on Windows:
     type C:\Users\YourUsername\.ssh\id_rsa
     ```
   - If you don't have an SSH key, generate one:
     ```bash
     ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
     ```
   - Then copy the **private key** (id_rsa) content

4. **SSH_PORT** (Optional)
   - Value: `22` (default SSH port)
   - Only add this if your SSH uses a different port

5. **DEPLOY_PATH**
   - Value: The full path where your project is on the server
   - Example: `/home/username/server` or `/var/www/server` or `/root/server`
   - This is where your git repository is cloned on the server

### Step 2: Set Up SSH Key on Server

If you generated a new SSH key, you need to add the **public key** to your server:

1. Copy your **public key** (id_rsa.pub):
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

2. On your server, add it to authorized_keys:
   ```bash
   # SSH into your server
   ssh user@192.168.1.80
   
   # Add the public key
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### Step 3: Verify Server Setup

Make sure on your server:

1. **Git is installed:**
   ```bash
   git --version
   ```

2. **Docker and Docker Compose are installed:**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Your project is cloned:**
   ```bash
   cd /path/to/your/project
   git remote -v  # Should show your GitHub repo
   ```

4. **SSH access works:**
   ```bash
   # From your local machine, test SSH:
   ssh user@192.168.1.80
   ```

### Step 4: Test the Deployment

1. **Push your changes:**
   ```bash
   cd backend
   git add .
   git commit -m "Add automatic deployment"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/shashiv367/backend/actions
   - You should see a workflow running
   - Click on it to see the deployment progress

3. **Verify on server:**
   ```bash
   # SSH into server
   ssh user@192.168.1.80
   cd /path/to/your/project/backend
   docker-compose ps  # Check if containers are running
   docker-compose logs backend  # Check logs
   ```

## 🔧 Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs:**
   - Go to Actions tab in your repo
   - Click on the failed workflow
   - Check the error messages

2. **Common issues:**

   **SSH Connection Failed:**
   - Verify SSH_HOST, SSH_USERNAME, and SSH_PRIVATE_KEY are correct
   - Test SSH manually: `ssh user@192.168.1.80`
   - Check if SSH port is correct (default is 22)

   **Permission Denied:**
   - Make sure SSH key is added to server's authorized_keys
   - Check file permissions: `chmod 600 ~/.ssh/authorized_keys`

   **Git Pull Failed:**
   - Verify DEPLOY_PATH is correct
   - Make sure git repository exists at that path
   - Check if user has permission to that directory

   **Docker Command Failed:**
   - Make sure Docker is installed and running
   - Check if user is in docker group: `sudo usermod -aG docker $USER`
   - Verify docker-compose.yml exists in backend directory

3. **Manual test on server:**
   ```bash
   # SSH into server
   ssh user@192.168.1.80
   
   # Navigate to project
   cd /path/to/your/project
   
   # Test the commands manually
   git pull origin main
   cd backend
   docker-compose down
   docker-compose up -d --build
   ```

## 📝 Workflow Details

The workflow (`.github/workflows/deploy.yml`) will:
1. Trigger on every push to `main` branch
2. Checkout your code
3. SSH into your server
4. Pull latest changes from git
5. Rebuild and restart Docker containers
6. Show recent logs

## 🔒 Security Notes

- ⚠️ Never commit your `.env` file or SSH keys to git
- ⚠️ Use GitHub Secrets for all sensitive information
- ⚠️ Consider using a dedicated deployment user with limited permissions
- ⚠️ Regularly rotate SSH keys

## 🎯 Next Steps

1. Add all required secrets to GitHub
2. Set up SSH key on server
3. Push a test commit to trigger deployment
4. Monitor the Actions tab for success/failure

## 📞 Need Help?

If deployment fails, check:
- GitHub Actions logs for error messages
- Server logs: `docker-compose logs`
- SSH connection: Test manually first



