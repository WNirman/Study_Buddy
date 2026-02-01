const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const subjectRoutes = require('./routes/subjects');
const statsRoutes = require('./routes/stats');
const examsRoutes = require('./routes/exams');
const unlocksRoutes = require('./routes/unlocks');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/unlocks', unlocksRoutes);

// Basic health check
app.get('/', (req, res) => {
    res.send('Study Analysis API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
