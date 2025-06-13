
const express = require('express');
const router = express.Router();
const supabase = require('../supabase'); // supabase 클라이언트 경로에 맞게 조정

// 추천 정비소 전체 조회
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recommended_shops')
      .select('*');

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('추천 정비소 조회 오류:', err.message);
    res.status(500).json({ error: '추천 정비소 조회 실패' });
  }
});

module.exports = router;
