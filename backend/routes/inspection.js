const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

//  테스트 라우트
router.get('/test', (req, res) => {
  res.send('✅ 점검 API 작동 확인됨');
});

//  전체 항목 조회 (카테고리, 정렬, 페이지네이션 포함)
router.get('/', async (req, res) => {
  const { category, page = 1, limit = 10, sort = 'id_asc' } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const [sortField, sortOrder] = sort.split('_');
  const validFields = ['id', 'title', 'category'];
  const validOrder = ['asc', 'desc'];
  const orderField = validFields.includes(sortField) ? sortField : 'id';
  const orderAsc = sortOrder === 'desc' ? false : true;

  //  count 먼저 따로 가져와서 offset 유효성 확인
  let countQuery = supabase
    .from('inspection_items')
    .select('*', { count: 'exact', head: true });

  if (category) {
    countQuery = countQuery.eq('category', category);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('❌ 전체 개수 조회 실패:', countError.message);
    return res.status(500).json({ error: '전체 개수 조회 실패', detail: countError.message });
  }

  //  유효하지 않은 offset인 경우 빈 배열 반환
  if (offset >= count) {
    return res.json({
      page: pageNum,
      limit: limitNum,
      total: count,
      items: []
    });
  }

  //  본 데이터 조회
  let query = supabase
    .from('inspection_items')
    .select('*')
    .order(orderField, { ascending: orderAsc })
    .range(offset, offset + limitNum - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ 항목 조회 실패:', error.message);
    return res.status(500).json({ error: '조회 실패', detail: error.message });
  }

  res.json({
    page: pageNum,
    limit: limitNum,
    total: count,
    items: data
  });
});

//  단일 항목 상세 조회
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('inspection_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ 상세 조회 실패:', error.message);
    return res.status(404).json({ error: '해당 항목이 존재하지 않습니다' });
  }

  res.json(data);
});

module.exports = router;
