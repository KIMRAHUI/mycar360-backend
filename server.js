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

/**
 *  허용 Origin 구성
 * - 기본값: 로컬(5173), 프로덕션 Vercel
 * - ENV 추가: CORS_ORIGINS="https://a.com,https://b.com"
 * - Vercel 프리뷰 *.vercel.app 자동 허용
 */
const ENV_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const staticAllowed = [
  'http://localhost:5173',                // Vite 기본 포트(프론트)
  'https://mycar360-frontend.vercel.app', // 프로덕션 프론트
];

const allowedOrigins = [...new Set([...staticAllowed, ...ENV_ORIGINS])];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Postman/curl 등은 origin 없음
  try {
    const url = new URL(origin);
    const host = url.host;

    // 1) 정확 일치
    if (allowedOrigins.includes(origin)) return true;

    // 2) Vercel 프리뷰 도메인 허용 (필요 시 프로젝트 prefix로 더 제한 가능)
    if (host.endsWith('.vercel.app')) return true;

    return false;
  } catch {
    return false;
  }
};

//  CORS 설정
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) callback(null, true);
    else callback(new Error('CORS 차단: ' + origin));
  },
  credentials: true,
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

//  기본 라우트
app.get('/', (req, res) => {
  res.send('🚀 MyCar360 백엔드 서버가 정상 작동 중입니다!');
});

//  서버 실행
app.listen(PORT, () => {
  console.log(`🚗 MyCar360 백엔드 실행 중: http://localhost:${PORT}`);
});
