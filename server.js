require('dotenv').config();
const express = require('express');
const cors = require('cors');

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const favoriteRoutes = require('./routes/favorites');
const nextInspectionRoutes = require('./routes/nextInspections');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const userByCarRoutes = require('./routes/userByCar');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5177',
  'https://mycar360-frontend.vercel.app'
];

// CORS 옵션 요청 사전 처리
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);
app.use('/api/next-inspection', nextInspectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-by-car', userByCarRoutes);

app.get('/', (req, res) => {
  res.send('🚀 MyCar360 백엔드 서버가 정상 작동 중입니다!');
});

app.listen(PORT, () => {
  console.log(`🚗 MyCar360 백엔드 실행 중: http://localhost:${PORT}`);
});
