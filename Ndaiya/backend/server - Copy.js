
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = 3019;
const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.urlencoded({extended:true}))
//db connection
mongoose.connect('mongodb://localhost:27017/ndaiya')
const db=mongoose.connection
db.once('open',()=>{
  console.log("Mongodb connection successful")
})

const userSchema =new mongoose.Schema({
  firstName: {type: String,required: true},
  laststName: {type: String,required: true},
  email: {type: String,required: true},
  phone: {type: String,required: true},
   

})

const Users=mongoose.model("data",userSchema)
app.get('/',(req,res)=>{
  
  res.sendFile(path.join(__dirname,'../frontend/index.html'))
})

app.post('/post',async(req,res)=>{
  const {firstName, laststName,email,phone}=req.body
    const user= new Users({ firstName, laststName,email,phone})
    await user.save()
    console.log(user)
    res.send("User created successfully")
})
// Start server

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

















/* server.js — Ndaiya Backend: Tutors & Learners API
// ✅ SOC 2–ready • ✅ Dotenvx Ops compatible • ✅ Mobile-money ready

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const winston = require('winston')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

// 🛡️ Security & Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',   // Vite/React dev
    'http://localhost:5500',   // VS Code Live Server
    'http://127.0.0.1:5500',
    'http://localhost:8080',   // Webpack/Vue
    // Add production domains later: 'https://ndaiya.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// 📝 Winston Logger — SOC 2 ready
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// ✅ Ensure logs directory exists
const fs = require('fs');
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

// 🔐 API Access Logger (for audit trails)
const apiLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      event: 'api_request',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.userId || 'anonymous',
    });
  });
  next();
};
app.use(apiLogger);

// 🌐 MongoDB Connection — ✅ FIXED: no deprecated options
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ndaiya';
mongoose.connect(mongoURI)
  .then(() => logger.info('✅ MongoDB connected successfully'))
  .catch(err => {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 🧾 Schemas — Minimal (uncomment full schemas later as needed)

// 🧑‍🏫 Tutor Schema
const TutorSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  phone: { 
    type: String, 
    required: true,
    match: [/^\+254\d{9}$/, 'Phone must be +254XXXXXXXXX (Kenya)']
  }
}, { timestamps: true }); // auto createdAt/updatedAt

// 🎓 Learner Schema
const LearnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  phone: { 
    type: String, 
    required: true,
    match: [/^\+260\d{9}$/, 'Phone must be +260XXXXXXXXX (Zambia)']
  }
}, { timestamps: true });

// 📦 Models
const Tutor = mongoose.model('Tutor', TutorSchema);
const Learner = mongoose.model('Learner', LearnerSchema);

// ====== ROUTES ======

// 🔹 Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    node: process.version,
    env: process.env.NODE_ENV || 'development'
  });
});

// 🔹 Tutors
app.get('/api/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find().select('-__v').sort({ lastName: 1, firstName: 1 });
    res.json(tutors);
  } catch (error) {
    logger.error('GET /tutors error:', error);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

app.post('/api/tutors', async (req, res) => {
  try {
    const tutor = new Tutor(req.body);
    const saved = await tutor.save();
    logger.info('TUTOR_CREATED', { tutorId: saved._id, email: saved.email });
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    logger.error('TUTOR_CREATE_ERROR:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tutors/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).select('-__v');
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
    res.json(tutor);
  } catch (error) {
    logger.error('GET tutor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 Learners
app.get('/api/learners', async (req, res) => {
  try {
    const learners = await Learner.find().select('-__v').sort({ lastName: 1, firstName: 1 });
    res.json(learners);
  } catch (error) {
    logger.error('GET /learners error:', error);
    res.status(500).json({ error: 'Failed to fetch learners' });
  }
});

app.post('/api/learners', async (req, res) => {
  try {
    const learner = new Learner(req.body);
    const saved = await learner.save();
    logger.info('LEARNER_CREATED', { learnerId: saved._id, email: saved.email });
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email or phone already registered' });
    }
    logger.error('LEARNER_CREATE_ERROR:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/learners/:id', async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id).select('-__v');
    if (!learner) return res.status(404).json({ error: 'Learner not found' });
    res.json(learner);
  } catch (error) {
    logger.error('GET learner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 Search
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query "q" required' });

  const regex = new RegExp(q, 'i');
  try {
    const tutors = await Tutor.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
    }).select('firstName lastName email').lean();

    const learners = await Learner.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
    }).select('firstName lastName email').lean();

    res.json({
      results: [
        ...tutors.map(t => ({ ...t, role: 'tutor' })),
        ...learners.map(l => ({ ...l, role: 'learner' }))
      ]
    });
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ❌ 404 Handler
app.use((req, res) => {
  logger.warn('404 Not Found:', { url: req.url, method: req.method });
  res.status(404).json({ error: 'Route not found' });
});

// 🚨 Global Error Handler
app.use((err, req, res, next) => {
  logger.error('UNHANDLED_ERROR:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  res.status(500).json({ error: 'Internal server error' });
});

// ▶️ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`🚀 Ndaiya backend running on port ${PORT}`);
  logger.info(`📡 MongoDB: ${mongoURI.replace(/\/\/(.*):(.*)@/, '//***:***@')}`);

  // 🔑 Dotenvx Ops Compliance Tip (per 2025-10-14 changelog)
  console.log('\n✅ SOC 2–Ready Setup:');
  console.log('   Foundational features — Sync, DB, and Audit — are completed.');
  console.log('   DB now links keys to project > file > version.');
  console.log('\n🔧 Run with Dotenvx Ops for full compliance:');
  console.log('   npx dotenvx run -- node server.js');
  console.log('   → Enables Sync, DB, Team, Radar & Audit reporting.');
});*/