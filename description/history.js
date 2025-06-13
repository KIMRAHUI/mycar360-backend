const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// 전체 점검 이력 조회
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

// 차량번호 기준 조회
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

// 이력 추가
router.post('/', async (req, res) => {
  const { car_number, inspection_type, shop_name, date, note, user_id, type } = req.body;

  const { data, error } = await supabase
    .from('inspection_history')
    .insert([{ car_number, inspection_type, shop_name, date, note, user_id, type }])
    .select();

  if (error) {
    console.error('❌ 이력 추가 실패:', error.message);
    return res.status(500).json({ message: '추가 실패', error });
  }

  if (type === '교체') {
    await updateParts(car_number, inspection_type, date, 'add');
  } else if (type === '점검') {
    await updateHistory(car_number, inspection_type, date, 'add');
  }

  res.status(201).json(data[0]);
});

// 이력 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { car_number, inspection_type, shop_name, date, note, type } = req.body;

  const { data: oldData, error: fetchError } = await supabase
    .from('inspection_history')
    .select('type, inspection_type, date')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('❌ 기존 이력 조회 실패:', fetchError.message);
    return res.status(500).json({ message: '기존 이력 조회 실패', error: fetchError });
  }

  const { error } = await supabase
    .from('inspection_history')
    .update({ inspection_type, shop_name, date, note, type })
    .eq('id', id);

  if (error) {
    console.error('❌ 이력 수정 실패:', error.message);
    return res.status(500).json({ message: '수정 실패', error });
  }

  if (oldData.type === '교체' && type !== '교체') {
    await updateParts(car_number, oldData.inspection_type, oldData.date, 'remove');
  } else if (oldData.type !== '교체' && type === '교체') {
    await updateParts(car_number, inspection_type, date, 'add');
  } else if (oldData.type === '교체' && type === '교체' &&
    (oldData.inspection_type !== inspection_type || oldData.date !== date)) {
    await updateParts(car_number, oldData.inspection_type, oldData.date, 'remove');
    await updateParts(car_number, inspection_type, date, 'add');
  }

  if (oldData.type === '점검' && type !== '점검') {
    await updateHistory(car_number, oldData.inspection_type, oldData.date, 'remove');
  } else if (oldData.type !== '점검' && type === '점검') {
    await updateHistory(car_number, inspection_type, date, 'add');
  } else if (oldData.type === '점검' && type === '점검' &&
    (oldData.inspection_type !== inspection_type || oldData.date !== date)) {
    await updateHistory(car_number, oldData.inspection_type, oldData.date, 'remove');
    await updateHistory(car_number, inspection_type, date, 'add');
  }

  res.sendStatus(204);
});

// 이력 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: deleted, error: fetchError } = await supabase
    .from('inspection_history')
    .select('car_number, type, inspection_type, date')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('❌ 삭제 전 조회 실패:', fetchError.message);
    return res.status(500).json({ message: '삭제 전 조회 실패', error: fetchError });
  }

  const { error } = await supabase
    .from('inspection_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ 이력 삭제 실패:', error.message);
    return res.status(500).json({ message: '삭제 실패', error });
  }

  if (deleted.type === '교체') {
    await updateParts(deleted.car_number, deleted.inspection_type, deleted.date, 'remove');
  } else if (deleted.type === '점검') {
    await updateHistory(deleted.car_number, deleted.inspection_type, deleted.date, 'remove');
  }

  res.sendStatus(204);
});

// parts 업데이트 함수
async function updateParts(car_number, partName, replacedAt, action) {
  const { data: vehicle, error: vErr } = await supabase
    .from('vehicle_info')
    .select('parts')
    .eq('car_number', car_number)
    .single();

  if (vErr || !vehicle) {
    console.error('❌ vehicle_info 조회 실패:', vErr?.message || '차량 정보 없음', car_number);
    return;
  }

  let updatedParts = Array.isArray(vehicle.parts) ? [...vehicle.parts] : [];

  if (action === 'add') {
    const exists = updatedParts.some(p => p.partName === partName && p.replacedAt === replacedAt);
    if (!exists) updatedParts.push({ partName, replacedAt });
  } else if (action === 'remove') {
    updatedParts = updatedParts.filter(
      (p) => !(p.partName === partName && p.replacedAt === replacedAt)
    );
  }

  const { error: uErr } = await supabase
    .from('vehicle_info')
    .update({ parts: updatedParts })
    .eq('car_number', car_number);

  if (uErr) {
    console.error('❌ parts 업데이트 실패:', uErr.message);
  } else {
    console.log('✅ vehicle_info.parts 업데이트 성공:', updatedParts);
  }
}

// history 업데이트 함수
async function updateHistory(car_number, label, performedAt, action) {
  const { data: vehicle, error: vErr } = await supabase
    .from('vehicle_info')
    .select('history')
    .eq('car_number', car_number)
    .single();

  if (vErr || !vehicle) {
    console.error('❌ vehicle_info 조회 실패:', vErr?.message || '차량 정보 없음', car_number);
    return;
  }

  let updatedHistory = Array.isArray(vehicle.history) ? [...vehicle.history] : [];

  if (action === 'add') {
    const exists = updatedHistory.some(h => h.label === label && h.performedAt === performedAt);
    if (!exists) updatedHistory.push({ label, performedAt });
  } else if (action === 'remove') {
    updatedHistory = updatedHistory.filter(
      (h) => !(h.label === label && h.performedAt === performedAt)
    );
  }

  const { error: uErr } = await supabase
    .from('vehicle_info')
    .update({ history: updatedHistory })
    .eq('car_number', car_number);

  if (uErr) {
    console.error('❌ history 업데이트 실패:', uErr.message);
  } else {
    console.log('✅ vehicle_info.history 업데이트 성공:', updatedHistory);
  }
}

module.exports = router;
