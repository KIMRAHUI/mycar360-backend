// routes/favorites.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ 로그인한 사용자의 찜 목록 조회
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId가 없습니다.' });
  }

  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('inspection_item_id')
    .eq('user_id', userId);

  if (favError) {
    console.error('찜 목록 조회 실패:', favError.message);
    return res.status(500).json({ message: '찜 항목을 불러오는 데 실패했습니다.', error: favError });
  }

  // ✅ 안정성 보완: 숫자 타입만 필터링
  const itemIds = favorites
    .map(f => f.inspection_item_id)
    .filter(id => typeof id === 'number' && !isNaN(id));

  if (!itemIds.length) {
    return res.json([]);
  }

  const { data: items, error: itemError } = await supabase
    .from('inspection_items')
    .select('id, title, category, description')
    .in('id', itemIds);

  if (itemError) {
    console.error('inspection_items 조회 실패:', itemError.message);
    return res.status(500).json({ message: '상세 항목을 불러오는 데 실패했습니다.', error: itemError });
  }

  res.json(items);
});

// ✅ 찜 추가
router.post('/', async (req, res) => {
  const { user_id, inspection_item_id } = req.body;

  if (!user_id || !inspection_item_id) {
    return res.status(400).json({ message: 'user_id 또는 inspection_item_id가 누락되었습니다.' });
  }

  const { data: existing, error: existError } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user_id)
    .eq('inspection_item_id', inspection_item_id);

  if (existError) {
    console.error('중복 확인 실패:', existError.message);
    return res.status(500).json({ message: '중복 확인 중 오류 발생', error: existError });
  }

  if (existing && existing.length > 0) {
    return res.status(409).json({ message: '이미 찜한 항목입니다.' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id, inspection_item_id }])
    .select();

  if (error) {
    console.error('찜 추가 실패:', error.message);
    return res.status(500).json({ message: '찜 추가에 실패했습니다.', error });
  }

  res.status(201).json(data[0]);
});

// ✅ 찜 해제
router.delete('/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { user_id } = req.query;

  if (!itemId || !user_id) {
    return res.status(400).json({ message: 'user_id 또는 itemId가 없습니다.' });
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user_id)
    .eq('inspection_item_id', itemId);

  if (error) {
    console.error('찜 삭제 실패:', error.message);
    return res.status(500).json({ message: '찜 삭제에 실패했습니다.', error });
  }

  res.sendStatus(204);
});

module.exports = router;
//