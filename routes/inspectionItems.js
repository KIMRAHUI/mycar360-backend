// routes/inspectionItems.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category, sort = 'title_asc' } = req.query;

  const offset = (page - 1) * limit;

  let query = supabase
    .from('inspection_items')
    .select('*', { count: 'exact' });

  if (category) {
    query = query.eq('category', category);
  }

  // 정렬 처리
  const [sortField, sortOrder] = sort.split('_');
  query = query.order(sortField, { ascending: sortOrder === 'asc' });

  query = query.range(offset, offset + Number(limit) - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('❌ inspection_items fetch error:', error);
    return res.status(500).json({ error: '데이터를 불러오지 못했습니다.' });
  }

  res.json({
    items: data,
    total: count,
  });
});

module.exports = router;
