const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

//  전체 점검 이력 조회
// GET /api/history
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('inspection_history')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('❌ 전체 이력 조회 실패:', error.message);
    return res.status(500).json({ message: '전체 조회 실패', error });
  }

  res.json(data);
});

//  차량번호 기준 점검 이력 조회
// GET /api/history/car/:carNumber
router.get('/car/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  const { data, error } = await supabase
    .from('inspection_history')
    .select('*')
    .eq('car_number', carNumber)
    .order('date', { ascending: false });

  if (error) {
    console.error('❌ 차량별 이력 조회 오류:', error.message);
    return res.status(500).json({ message: '조회 실패', error });
  }

  res.json(data);
});

//  점검 이력 추가
// POST /api/history
router.post('/', async (req, res) => {
  const { car_number, inspection_type, shop_name, date, note, user_id } = req.body;

  const { data, error } = await supabase
    .from('inspection_history')
    .insert([
      { car_number, inspection_type, shop_name, date, note, user_id }
    ])
    .select(); // 삽입된 데이터 반환

  if (error) {
    console.error('❌ 이력 추가 실패:', error.message);
    return res.status(500).json({ message: '추가 실패', error });
  }

  res.status(201).json(data[0]);
});

//  점검 이력 수정
// PUT /api/history/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { inspection_type, shop_name, date, note } = req.body;

  const { error } = await supabase
    .from('inspection_history')
    .update({ inspection_type, shop_name, date, note })
    .eq('id', id);

  if (error) {
    console.error('❌ 이력 수정 실패:', error.message);
    return res.status(500).json({ message: '수정 실패', error });
  }

  res.sendStatus(204);
});

//  점검 이력 삭제
// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('inspection_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ 이력 삭제 실패:', error.message);
    return res.status(500).json({ message: '삭제 실패', error });
  }

  res.sendStatus(204);
});

module.exports = router;
