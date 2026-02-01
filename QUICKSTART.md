# 🚀 StudyBuddy - Quick Start Guide

## ⚡ Super Quick Start (Windows)

```bash
# 1. Make sure MySQL is running (XAMPP Control Panel)
# 2. Double-click: start-windows.bat
# 3. Browser opens to http://localhost:5173
# Done! ✅
```

## 📋 Manual Setup (5 minutes)

### Step 1: Database (1 min)
```bash
cd server
node initDb.js
```

### Step 2: Backend Server (2 min)
```bash
cd server
npm install
npm run dev
# Runs on: http://localhost:3000
```

### Step 3: Frontend Server (2 min)
```bash
cd client
npm install
npm run dev
# Runs on: http://localhost:5173
```

### Step 4: Open Browser
```
http://localhost:5173
```

## 👤 First Login

1. Click "Sign up"
2. Enter username & password
3. Choose student type:
   - **School Student** - Tasks + Streaks
   - **Undergraduate** - Tasks + GPA tracking
   - **Working/Learning** - Tasks + Streaks
4. If UG: Set target GPA
5. Click "Create Account"

## 🎯 Main Features

| Feature | How to Use |
|---------|-----------|
| 📝 Tasks | Task List → Add Task |
| ⏰ Focus Timer | START WORKING button |
| 📊 GPA Tracking | GPA & Marks (UG only) |
| 📈 Progress | Profile (activity heatmap) |
| 🏆 Achievements | Rewards (unlock at streaks) |
| 📅 Exams | GPA & Marks → Add Exam |

## 🔧 If Something Breaks

| Problem | Solution |
|---------|----------|
| MySQL won't connect | Start MySQL, check .env credentials |
| Backend error | cd server && npm install |
| Frontend error | cd client && npm install |
| Tasks not loading | Clear browser cache (Ctrl+Shift+Del) |
| Port already in use | Change port in .env or vite.config.ts |

## 📁 File Structure

```
StudyBuddy/
├── server/       ← Backend (Node.js + MySQL)
├── client/       ← Frontend (React + TypeScript)
├── README.md     ← Full documentation
├── SETUP.md      ← Detailed setup
└── FEATURES.md   ← Feature checklist
```

## 🌍 Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend | 3000 |
| MySQL | 3306 |

## ✅ Checklist Before Using

- [ ] MySQL running
- [ ] Node.js installed
- [ ] Database initialized
- [ ] Backend server running (npm run dev in server)
- [ ] Frontend server running (npm run dev in client)
- [ ] Browser at http://localhost:5173

## 🎓 How to Use Features

### Create & Complete Tasks
```
1. Go to "Task List"
2. Enter task title
3. Set priority & time
4. Click "Add Task"
5. Check box to complete
6. Earn streak points!
```

### Use Focus Timer
```
1. Click "START WORKING"
2. Set duration (default 25 min)
3. Click "START"
4. Stay focused!
5. Get notification when done
6. Earn 50 points + break timer
```

### Track GPA (Undergraduates)
```
1. Go to "GPA & Marks"
2. Click "Add Subject"
3. Enter subject name & credits
4. Add ICA marks (multiple)
5. Add Final Exam mark
6. See automatic GPA calculation
```

### View Activity (Everyone)
```
1. Click "Profile"
2. See yearly activity heatmap
3. Check consistency score
4. View next reward to unlock
5. See collected achievements
```

## 🎮 Gamification

**Streak System**: Consecutive days of study
- 7 days → 🦉 Knowledge Owl
- 14 days → 🦊 Study Fox  
- 21 days → 🦁 Focus Lion
- 30 days → 🐲 Master Dragon

**Points**: 50 points per focus session

**Profile**: See yearly heatmap of all activity

## 🔐 Security

Currently:
- User authentication ✓
- Password stored (needs hashing)
- Database isolated ✓

## 🛠️ Configuration

### Change Database Credentials
Edit `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=study_buddy
PORT=3000
```

### Change Frontend Port
Edit `client/vite.config.ts`:
```typescript
server: {
  port: 5173,  // Change this
}
```

### Change Backend Port
Edit `server/.env`:
```env
PORT=3000  // Change this
```

## 📞 Help & Documentation

- **README.md** - Full feature overview
- **SETUP.md** - Detailed setup troubleshooting
- **FEATURES.md** - Complete feature checklist
- **IMPLEMENTATION.md** - Technical details

## 🚨 Emergency Commands

```bash
# Clear and rebuild database
node server/initDb.js

# Reinstall all dependencies
cd server && npm install
cd ../client && npm install

# Start fresh (delete data!)
# DELETE DATABASE study_buddy;
# Then run initDb.js again

# Check if ports are in use
netstat -an | findstr :5173
netstat -an | findstr :3000
```

## 🎉 You're All Set!

Everything is implemented and ready to use. Here's what's included:

✅ Task Management with Reminders  
✅ GPA Tracking (for undergraduates)  
✅ Focus Timer with Gamification  
✅ Activity Tracking & Heatmap  
✅ Achievement System  
✅ Dark/Light Themes  
✅ Multi-device Support  
✅ Exam Countdown  
✅ Daily Performance Analysis  

**Start creating tasks and building your study streak! 🚀**

---

Need more help? Check the full documentation in README.md

**Status**: ✅ Ready to Use | **Version**: 1.0.0
