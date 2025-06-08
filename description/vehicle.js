const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 차량 번호로 차량 정보 조회
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;
  console.log('📥 [GET /vehicle-info] 요청 차량번호:', carNumber);

  try {
    const { data, error } = await supabase
      .from('vehicle_info')
      .select('*')
      .eq('car_number', carNumber.trim())
      .maybeSingle();

    if (error) {
      console.error('❌ 차량 조회 오류:', error.message);
      return res.status(500).json({ message: '차량 정보 조회 실패', error });
    }

    if (!data) {
      console.warn('⚠️ 차량 정보 없음 - car_number:', carNumber);
      return res.status(404).json({ message: '차량 정보 없음' });
    }

    // 응답 전 JSONB 타입 파싱 (string으로 들어오는 경우만 처리)
    try {
      if (typeof data.parts === 'string') data.parts = JSON.parse(data.parts);
      if (typeof data.history === 'string') data.history = JSON.parse(data.history);
    } catch (err) {
      console.warn('⚠️ JSON 파싱 실패 또는 이미 객체입니다:', err.message);
    }

    console.log('✅ 차량 정보 조회 결과:', data);
    res.json(data);
  } catch (err) {
    console.error('❌ 서버 처리 오류:', err.message);
    res.status(500).json({ message: '서버 오류 발생', error: err.message });
  }
});

module.exports = router;
