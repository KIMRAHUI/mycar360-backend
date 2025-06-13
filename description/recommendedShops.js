
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 추천 정비소 전체 조회
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recommended_shops')
      .select('id, name, address, lat, lng, tags, description, image_url, rating, phone');

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('추천 정비소 조회 오류:', err.message);
    res.status(500).json({ error: '추천 정비소 조회 실패' });
  }
});

module.exports = router;
