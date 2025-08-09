require('dotenv').config();
const express = require('express');
const cors = require('cors');

//  라우트 불러오기
const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const inspectionItemsRoutes = require('./routes/inspectionItems');
const favoriteRoutes = require('./routes/favorites');
const nextInspectionRoutes = require('./routes/nextInspections');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const userByCarRoutes = require('./routes/userByCar');
const recommendedShopsRoutes = require('./routes/recommendedShops');

const app = express();
const PORT = process.env.PORT || 3000;

//  허용 Origin 목록 (정확 일치만)
const allowedOrigins = [
  'http://localhost:5173',                 // ← 로컬 프론트 (Vite 기본 포트)
  'https://mycar360-frontend.vercel.app'   // ← 프로덕션 프론트
];

//  CORS 설정 (프리뷰 *.vercel.app 도 허용)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman/curl 등

    try {
      const host = new URL(origin).host;
      if (allowedOrigins.includes(origin) || host.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (_) {
      // URL 파싱 실패 시 아래에서 차단 처리
    }
    return callback(new Error('CORS 차단: ' + origin));
  },
  credentials: true
}));

//  Preflight(OPTIONS) 처리
app.options('*', cors());

app.use(express.json());

//  API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection', inspectionRoutes);
app.use('/api/inspection-items', inspectionItemsRoutes);
app.use('/api/next-inspection', nextInspectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-by-car', userByCarRoutes);
app.use('/api/recommended-shops', recommendedShopsRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('🚀 MyCar360 백엔드 서버가 정상 작동 중입니다!');
});

//  서버 실행
app.listen(PORT, () => {
  console.log(`🚗 MyCar360 백엔드 실행 중: http://localhost:${PORT}`);
});
