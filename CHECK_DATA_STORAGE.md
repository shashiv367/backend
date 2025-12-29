# How to Check if User Data is Stored in the Server

## Method 1: Using the API Endpoint (Easiest)

I've added a test endpoint to check all stored users:

**Endpoint:** `GET http://192.168.1.80:5000/api/auth/users`

### Using Browser:
1. Open your browser
2. Navigate to: `http://192.168.1.80:5000/api/auth/users`
3. You should see a JSON response with all users (passwords are excluded)

### Using curl (Command Line):
```bash
curl http://192.168.1.80:5000/api/auth/users
```

### Using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://192.168.1.80:5000/api/auth/users" -Method Get
```

### Expected Response:
```json
{
  "count": 2,
  "users": [
    {
      "_id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Method 2: Check MongoDB Directly

### If using Docker Compose:

1. **Connect to MongoDB container:**
   ```bash
   docker exec -it mongodb mongosh -u admin -p StrongMongoPass123 --authenticationDatabase admin
   ```

2. **Switch to your database:**
   ```javascript
   use myapp
   ```

3. **List all users:**
   ```javascript
   db.users.find().pretty()
   ```

4. **Count users:**
   ```javascript
   db.users.countDocuments()
   ```

5. **Find specific user:**
   ```javascript
   db.users.findOne({ username: "yourusername" })
   ```

### If using local MongoDB (not Docker):

1. **Connect to MongoDB:**
   ```bash
   mongosh
   # or
   mongo
   ```

2. **Switch to database:**
   ```javascript
   use myapp
   ```

3. **List all users:**
   ```javascript
   db.users.find().pretty()
   ```

---

## Method 3: Check Server Logs

When a user signs up, you should see console logs in your backend server:

**On successful signup:**
- The server should log: `✅ Connected to MongoDB`
- No error messages should appear

**If there's an error:**
- Check the server console for error messages
- Common errors:
  - `MongoDB connection error` - Database not connected
  - `Signup error: ...` - Error during user creation

---

## Method 4: Test Signup and Verify

1. **Sign up a new user** through your frontend
2. **Check the response** - Should return:
   ```json
   {
     "message": "User created successfully",
     "token": "...",
     "user": {
       "id": "...",
       "username": "...",
       "email": "..."
     }
   }
   ```

3. **Try to sign up with the same username/email again**
   - Should get error: "Username already exists" or "Email already exists"
   - This confirms the user was saved

4. **Try to login** with the same credentials
   - If login works, the user is definitely stored

---

## Method 5: Check Database Connection

Verify MongoDB is connected:

**Endpoint:** `GET http://192.168.1.80:5000/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Troubleshooting

### If no users are showing:

1. **Check MongoDB connection:**
   - Verify MongoDB is running
   - Check connection string in `server.js` or `.env`
   - Check server logs for connection errors

2. **Check if signup is actually being called:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try signing up
   - Check if request to `/api/auth/signup` is successful

3. **Check server console:**
   - Look for error messages
   - Verify `✅ Connected to MongoDB` message appears

4. **Verify environment variables:**
   - Make sure `MONGODB_URI` is set correctly
   - Check `.env` file exists and has correct values

---

## Security Note

⚠️ **IMPORTANT:** The `/api/auth/users` endpoint is for testing only. 
- Remove it before deploying to production, OR
- Add authentication/authorization to protect it
- Never expose user data in production without proper security



