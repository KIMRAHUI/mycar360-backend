const express = require('express');
const cors = require('cors');
require('dotenv').config();

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const favoriteRoutes = require('./routes/favorites');
const nextInspectionRoutes = require('./routes/nextInspections');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowlist = [
      'http://localhost:5173',
      'http://localhost:5177',
      'https://mycar360.vercel.app'
    ];
    if (!origin || allowlist.includes(origin) || origin.includes('mycar360-frontend')) {
      callback(null, true);
    } else {
      callback(new Error('CORS 차단됨: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

//라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);
app.use('/api/next-inspection', nextInspectionRoutes);
app.use('/api/users', userRoutes); 

// 테스트 라우트
app.get('/test', (req, res) => {
  res.send('✅ 서버 연결 정상 작동 중!');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
