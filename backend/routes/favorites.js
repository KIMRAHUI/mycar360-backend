const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 로그인한 사용자의 찜 목록 조회
// GET /api/favorites/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id, inspection_item_id }]);
    

  if (error) {
    console.error('찜 목록 조회 실패:', error.message);
    return res.status(500).json({ message: '찜 항목을 불러오는 데 실패했습니다.', error });
  }

  const formatted = data.map((fav) => ({
    inspection_item_id: fav.inspection_item_id,
    title: fav.inspection_items?.title,
    category: fav.inspection_items?.category,
    description: fav.inspection_items?.description,
  }));

  res.json(formatted);
});

// 찜 추가
// POST /api/favorites
router.post('/', async (req, res) => {
  const { user_id, inspection_item_id } = req.body;

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user_id)
    .eq('inspection_item_id', inspection_item_id);

  if (existing.length > 0) {
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

// 찜 해제
// DELETE /api/favorites/:itemId?user_id=123
router.delete('/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { user_id } = req.query;

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
