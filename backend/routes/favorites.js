const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ✅ 로그인한 사용자의 찜 목록 조회
// GET /api/favorites/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // 🔧 Supabase 관계 설정이 없어서 조인 제거 (inspection_items 안에 접근 불가하므로)
  const { data, error } = await supabase
    .from('favorites')
    .select('id, inspection_item_id') // ✅ 조인 제거 → 필요한 필드만 조회
    .eq('user_id', userId);

  if (error) {
    console.error('❌ 찜 목록 조회 실패:', error.message);
    return res.status(500).json({ message: '찜 항목을 불러오는 데 실패했습니다.', error });
  }

  res.json(data); // 👈 프론트에서 inspection_items 상세가 필요하면 별도 요청하도록 설계
});

// ✅ 찜 추가
// POST /api/favorites
router.post('/', async (req, res) => {
  const { user_id, inspection_item_id } = req.body;

  // ✅ 중복 방지: 같은 항목을 중복 찜하지 않도록 확인
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user_id)
    .eq('inspection_item_id', inspection_item_id);

  if (existing.length > 0) {
    return res.status(409).json({ message: '이미 찜한 항목입니다.' });
  }

  // ✅ 찜 추가
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id, inspection_item_id }])
    .select();

  if (error) {
    console.error('❌ 찜 추가 실패:', error.message);
    return res.status(500).json({ message: '찜 추가에 실패했습니다.', error });
  }

  res.status(201).json(data[0]);
});

// ✅ 찜 해제
// DELETE /api/favorites/:itemId?user_id=123
router.delete('/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { user_id } = req.query;

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user_id)
    .eq('inspection_item_id', itemId); // ✅ 특정 사용자 + 특정 항목 조합으로 삭제

  if (error) {
    console.error('❌ 찜 삭제 실패:', error.message);
    return res.status(500).json({ message: '찜 삭제에 실패했습니다.', error });
  }

  res.sendStatus(204); // ✅ 삭제 성공 시 응답 없음
});

module.exports = router;
