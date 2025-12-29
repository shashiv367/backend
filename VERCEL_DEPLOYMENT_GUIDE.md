# 🚀 Complete Guide: Deploying Backend to Vercel

This guide will walk you through deploying your Express.js backend to Vercel step by step.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub account
- ✅ Your backend code pushed to a GitHub repository
- ✅ A MongoDB database (MongoDB Atlas recommended for production)
- ✅ Node.js installed locally (for testing)
- ✅ A Vercel account (free tier is fine)

---

## Step 1: Prepare Your MongoDB Database

### Option A: Use MongoDB Atlas (Recommended for Production)

1. **Sign up for MongoDB Atlas:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account (M0 cluster is free)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Set up Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set up Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add Vercel's IP ranges)
   - Click "Confirm"

5. **Get Your Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `myapp`)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority`

### Option B: Use Your Existing MongoDB

If you already have a MongoDB instance, make sure:
- It's accessible from the internet (not just localhost)
- You have the connection string ready
- Network security allows connections from Vercel

---

## Step 2: Install Vercel CLI (Optional but Recommended)

You can deploy via the web interface, but CLI is faster for updates:

```bash
npm install -g vercel
```

Or use npx (no installation needed):
```bash
npx vercel
```

---

## Step 3: Configure Your Project

Your project already has the necessary files:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function handler
- ✅ `package.json` - Dependencies

**Important:** Make sure your `package.json` has all dependencies listed. Your current setup looks good!

---

## Step 4: Deploy to Vercel

### Method A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up or log in with your GitHub account

2. **Import Your Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your repository (e.g., `shashiv367/backend`)

3. **Configure Project Settings:**
   - **Framework Preset:** Other (or Node.js)
   - **Root Directory:** `backend` (if your backend is in a subdirectory)
   - **Build Command:** Leave empty (or `npm install` if needed)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   | Name | Value | Description |
   |------|-------|-------------|
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
   | `JWT_SECRET` | `your-secret-key` | A random secret key for JWT tokens |
   | `NODE_ENV` | `production` | Environment setting |

   **Important:**
   - For `JWT_SECRET`, generate a random string (you can use: `openssl rand -base64 32`)
   - Make sure `MONGODB_URI` includes your password and database name
   - Click "Save" after adding each variable

5. **Deploy:**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 1-2 minutes)
   - You'll get a URL like: `https://your-project.vercel.app`

### Method B: Deploy via CLI

1. **Login to Vercel:**
   ```bash
   cd backend
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? → No (first time) or Yes (updates)
   - Project name? → Enter a name or press Enter
   - Directory? → `./` (current directory)
   - Override settings? → No

3. **Add Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB connection string
   
   vercel env add JWT_SECRET
   # Paste your JWT secret key
   
   vercel env add NODE_ENV
   # Enter: production
   ```

4. **Redeploy with Environment Variables:**
   ```bash
   vercel --prod
   ```

---

## Step 5: Test Your Deployment

Once deployed, test your API endpoints:

1. **Health Check:**
   ```
   GET https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Signup:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

3. **Test Login:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

---

## Step 6: Update Your Frontend (If Applicable)

Update your frontend API base URL to point to your Vercel deployment:

```javascript
// Example: Update your API base URL
const API_BASE_URL = 'https://your-project.vercel.app/api'
```

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solutions:**
- ✅ Check that `MONGODB_URI` is set correctly in Vercel environment variables
- ✅ Verify MongoDB Atlas network access allows connections from anywhere
- ✅ Make sure your MongoDB password doesn't have special characters (or URL-encode them)
- ✅ Check MongoDB Atlas connection string format

### Issue: "Function timeout"

**Solutions:**
- ✅ Vercel free tier has a 10-second timeout for serverless functions
- ✅ Optimize your database queries
- ✅ Consider upgrading to Vercel Pro for longer timeouts

### Issue: "Module not found"

**Solutions:**
- ✅ Make sure all dependencies are in `package.json`
- ✅ Check that `api/index.js` has correct import paths (using `../` for parent directory)
- ✅ Verify `vercel.json` points to the correct file

### Issue: "CORS errors"

**Solutions:**
- ✅ Your `cors()` middleware should handle this
- ✅ If issues persist, configure CORS to allow your frontend domain:
  ```javascript
  app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
  }))
  ```

### Issue: "Environment variables not working"

**Solutions:**
- ✅ Make sure variables are added in Vercel dashboard
- ✅ Redeploy after adding environment variables
- ✅ Check variable names match exactly (case-sensitive)
- ✅ For CLI: Use `vercel env pull` to sync local `.env` file

---

## 📝 Important Notes

### MongoDB Connection in Serverless

The `api/index.js` file includes connection caching to handle serverless cold starts efficiently. This is important because:
- Serverless functions can be "cold" (not running)
- Each function invocation might be in a new container
- Caching the connection prevents multiple connection attempts

### API Routes

All your API routes are accessible at:
- `https://your-project.vercel.app/api/auth/*` - Authentication routes
- `https://your-project.vercel.app/api/health` - Health check
- `https://your-project.vercel.app/api/db/stats` - Database statistics

### Custom Domain (Optional)

To use a custom domain:
1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your domain
4. Follow DNS configuration instructions

---

## 🔄 Updating Your Deployment

### Via Dashboard:
- Push changes to your GitHub repository
- Vercel will automatically redeploy (if connected via GitHub)

### Via CLI:
```bash
cd backend
vercel --prod
```

---

## 📊 Monitoring

- **Logs:** View function logs in Vercel dashboard → Your Project → "Functions" tab
- **Analytics:** Vercel provides analytics on function invocations
- **Errors:** Check the "Logs" section for any runtime errors

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] MongoDB connection string is correct and accessible
- [ ] Environment variables are set in Vercel
- [ ] Health check endpoint works: `/api/health`
- [ ] Signup endpoint works: `/api/auth/signup`
- [ ] Login endpoint works: `/api/auth/login`
- [ ] JWT_SECRET is set and secure
- [ ] CORS is configured for your frontend domain
- [ ] All routes are working as expected

---

## 🎉 You're Done!

Your backend is now live on Vercel! 

**Your API URL:** `https://your-project.vercel.app`

Remember to:
- Keep your MongoDB connection string secure
- Use a strong JWT_SECRET
- Monitor your Vercel dashboard for any issues
- Set up proper CORS for your frontend domain

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Verify environment variables are set correctly
3. Test MongoDB connection string locally first
4. Check Vercel status page: https://vercel-status.com

Good luck with your deployment! 🚀

