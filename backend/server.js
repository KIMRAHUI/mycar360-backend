const express = require('express');
const cors = require('cors');
require('dotenv').config();

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');
const favoriteRoutes = require('./routes/favorites');

const app = express();

//  CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5177', 'https://mycar360.vercel.app'],
  credentials: true
}));

app.use(express.json());

//  라우터 등록
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/vehicle-info', vehicleRouter);
app.use('/api/inspection-items', inspectionRoutes);

//  서버 시작
const PORT = process.env.PORT || 5000; // Render는 자동으로 PORT를 설정함

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
