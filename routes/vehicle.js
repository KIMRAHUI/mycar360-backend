const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 차량 번호로 차량 정보 조회
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  const { data, error } = await supabase
    .from('vehicle_info')
    .select('*')
    .eq('car_number', carNumber)
    .maybeSingle();

  if (error) {
    console.error('❌ 차량 조회 오류:', error.message);
    return res.status(500).json({ message: '차량 정보 조회 실패', error });
  }

  if (!data) {
    return res.status(404).json({ message: '차량 정보 없음' });
  }

  // JSONB 파싱 예외 처리
  try {
    if (typeof data.parts === 'string') data.parts = JSON.parse(data.parts);
    if (typeof data.history === 'string') data.history = JSON.parse(data.history);
  } catch (err) {
    console.warn('⚠️ JSON 파싱 스킵: 이미 객체일 수 있음');
  }

  res.json(data);
});

module.exports = router;
