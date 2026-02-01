# StudyBuddy Setup Guide

Quick start guide for running StudyBuddy on your local machine.

## Requirements

- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Database Setup

**Start MySQL:**
- If using XAMPP: Start MySQL from XAMPP Control Panel
- Or run MySQL server locally

**Initialize Database:**
```bash
cd server
node initDb.js
```

This will:
- Create the `study_buddy` database
- Create all required tables (users, tasks, subjects, marks, exams, focus_sessions, unlocks)
- Set up proper relationships

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# Change:
# DB_HOST=localhost
# DB_USER=root (or your MySQL user)
# DB_PASSWORD= (your password if any)
# DB_NAME=study_buddy

# Start backend server
npm run dev
```

✓ Backend should be running on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

✓ Frontend should be running on `http://localhost:5173`

### 4. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## First Time Usage

1. **Sign Up**
   - Click "Sign up" link
   - Enter username and password
   - Select student type:
     - School Student (basic task tracking)
     - Undergraduate (includes GPA tracking)
     - Working/Online Learner (task tracking without GPA)
   - If Undergraduate: Set your target GPA
   - Click "Create Account"

2. **Dashboard**
   - You'll see the main dashboard
   - Add subjects (if undergraduate)
   - Create study tasks
   - View exam countdown

3. **Create Your First Task**
   - Go to "Task List" in sidebar
   - Type your task title
   - Set priority (low/medium/high)
   - Set time (optional)
   - Click "Add Task"

4. **Start Studying**
   - Click "START WORKING" button
   - Set your focus duration
   - Press START when ready
   - Full-screen focus mode with timer
   - Earn points when complete

## Troubleshooting

### "Cannot connect to MySQL"
- Verify MySQL is running
- Check `.env` credentials
- Try: `node initDb.js` again
- Check MySQL port (default 3306)

### "Frontend can't connect to backend"
- Ensure backend server is running (`npm run dev` in server folder)
- Check that port 3000 is not in use
- Verify CORS is enabled in server

### "Database tables don't exist"
- Run `node initDb.js` from server directory
- Check for errors in console
- Verify MySQL user has create permissions

### "Tasks not loading after login"
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify API calls in Network tab
- Clear browser cache and reload

### "Theme not persisting"
- Clear browser localStorage
- Theme will be reset on next login
- (localStorage persistence to be added)

## Building for Production

### Frontend Build
```bash
cd client
npm run build
```
This creates optimized build in `client/dist/` directory.

### Backend Production
```bash
cd server
npm install --production
NODE_ENV=production npm start
```

## Commands Reference

**Backend**
```bash
npm install          # Install dependencies
npm run dev          # Start in development mode
npm start            # Start in production mode
node initDb.js       # Initialize database
```

**Frontend**
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Create production build
npm run preview      # Preview production build
```

## Database Backup

### Export Database
```bash
mysqldump -u root -p study_buddy > backup.sql
```

### Restore Database
```bash
mysql -u root -p study_buddy < backup.sql
```

## Resetting Everything

**Warning: This will delete all data!**

```bash
# Stop both servers (Ctrl+C)

# Delete database
mysql -u root -p -e "DROP DATABASE study_buddy;"

# Reinitialize
cd server
node initDb.js

# Restart servers
```

## Performance Tips

1. **Clear Browser Cache**
   - F12 → Application → Clear storage

2. **Check Network**
   - F12 → Network tab to see API calls
   - Should see responses from localhost:3000

3. **Monitor Database**
   - Use MySQL Workbench for monitoring
   - Check table sizes with: `SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema='study_buddy';`

## Common Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- MySQL: `localhost:3306`

If these are in use, you can change:
- Frontend: Edit `client/vite.config.ts`
- Backend: Edit `PORT` in `server/.env`
- MySQL: Edit `DB_HOST` and port in `server/.env`

## Next Steps

1. ✅ Setup complete!
2. Create your first task
3. Try the focus timer (Work Mode)
4. If undergraduate, add subjects and marks
5. Build up your study streak
6. Unlock achievement characters

For more details, see [README.md](./README.md)

Happy studying! 📚
