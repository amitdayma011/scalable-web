# Quick Start Guide

## Prerequisites Installation

### 1. Install MongoDB (Choose One Option)

#### Option A: MongoDB Atlas (Cloud - Recommended for Development)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" and get your connection string
5. Update `backend/.env` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scalable-web?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB Installation
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB following the installer instructions
3. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
4. Your connection string will be: `mongodb://localhost:27017/scalable-web`

### 2. Verify Node.js Installation
```bash
node --version  # Should be v18 or higher
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Running the Application

### Step 1: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Make sure .env file is configured with your MongoDB URI

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### Step 2: Start the Frontend (Open a new terminal)

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 3: Access the Application

Open your browser and go to `http://localhost:5173`

1. Click "Create a new account" to sign up
2. Fill in your details and create an account
3. You'll be automatically logged in and redirected to the dashboard
4. Start creating tasks!

## Troubleshooting

### MongoDB Connection Error
- **Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`
- **Solution**: 
  - Make sure MongoDB is running (if using local installation)
  - Check your connection string in `.env`
  - For Atlas, ensure your IP address is whitelisted in Network Access

### Port Already in Use
- **Problem**: `Error: listen EADDRINUSE: address already in use :::5000`
- **Solution**: 
  - Kill the process using the port: `npx kill-port 5000`
  - Or change the PORT in `backend/.env`

### CORS Error
- **Problem**: CORS policy error in browser console
- **Solution**: 
  - Ensure backend is running on port 5000
  - Check that `VITE_API_URL` in `frontend/.env` matches your backend URL

### Module Not Found
- **Problem**: `Error: Cannot find module 'express'`
- **Solution**: Run `npm install` in the respective directory (backend or frontend)

## Default Users for Testing

After signup, you can create your own account. No default users are provided for security reasons.

## Environment Variables Checklist

### Backend (.env)
- [ ] `PORT` - Set to 5000
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - A secure random string (minimum 32 characters)
- [ ] `JWT_EXPIRE` - Token expiration time (e.g., '7d')
- [ ] `NODE_ENV` - Set to 'development'

### Frontend (.env)
- [ ] `VITE_API_URL` - Set to `http://localhost:5000/api`

## Next Steps

1. ✅ Create your account
2. ✅ Explore the dashboard
3. ✅ Create some tasks
4. ✅ Try the search and filter features
5. ✅ Edit your profile
6. ✅ Test task CRUD operations

## Production Deployment

See the main README.md for production deployment instructions.

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure both backend and frontend servers are running
4. Check MongoDB connection
5. Review the troubleshooting section above

Happy coding! 🚀
