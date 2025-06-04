// routes/userByCar.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 차량 번호로 사용자 정보 조회
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('car_number', decodeURIComponent(carNumber))
      .single();

    if (error || !data) {
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    res.json(data);
  } catch (err) {
    console.error('❌ 사용자 조회 실패:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
