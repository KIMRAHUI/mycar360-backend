const express = require('express');
const cors = require('cors');
require('dotenv').config();

const historyRoutes = require('./routes/history');
const vehicleRouter = require('./routes/vehicle'); 
const inspectionRoutes = require('./routes/inspection'); 
const favoriteRoutes = require('./routes/favorites');

const app = express();

//  미들웨어
app.use(cors());
app.use(express.json());
app.use('/api/favorites', favoriteRoutes);

//  라우터 등록
app.use('/api/history', historyRoutes);           // 점검 이력 API
app.use('/api/vehicle-info', vehicleRouter);      // 차량 정보 API
app.use('/api/inspection-items', inspectionRoutes); // 점검 항목 API

//  서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
