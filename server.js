require('dotenv').config(); // .env 설정 로드

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

//  CORS 설정 (credentials 허용 + origin 정확히 지정)
const allowedOrigins = [
  'http://localhost:5177',
  'https://mycar360-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS 차단: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

//  라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);
app.use('/api/next-inspection', nextInspectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-by-car', userByCarRoutes);

// 기본 루트 확인용
app.get('/', (req, res) => {
  res.send('🚀 MyCar360 백엔드 서버가 정상 작동 중입니다!');
});

//  서버 실행
app.listen(PORT, () => {
  console.log(`🚗 MyCar360 백엔드 실행 중: http://localhost:${PORT}`);
});
