const express = require('express');
const cors = require('cors');
require('dotenv').config();

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// ✅ CORS 설정 – Vercel 프론트 주소 포함
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5177',
    'https://mycar360.vercel.app',
    'https://mycar360-frontend-jx8b9l6t2-kimrahuis-projects.vercel.app',
    'https://mycar360-frontend-bko895jlq-kimrahuis-projects.vercel.app',
    'https://mycar360-frontend-7f3l3p7h6-kimrahuis-projects.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// ✅ 라우터 등록
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);

// ✅ 테스트 라우트
app.get('/test', (req, res) => {
  res.send('✅ 서버 연결 정상 작동 중!');
});

// ✅ 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
