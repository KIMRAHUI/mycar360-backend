// routes/nextInspections.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// [GET] /api/next-inspection/:carNumber
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  // 1. 해당 차량의 최근 점검 이력 가져오기
  const { data: history, error: historyError } = await supabase
    .from('inspection_history')
    .select('inspection_type, date')
    .eq('car_number', carNumber)
    .order('date', { ascending: false })
    .limit(5);

  if (historyError) {
    console.error('❌ 점검 이력 불러오기 실패:', historyError.message);
    return res.status(500).json({ message: '점검 이력을 불러오지 못했습니다.', error: historyError });
  }

  if (!history || history.length === 0) {
    return res.json({ message: '점검 이력이 없습니다.', nextInspections: [] });
  }

  // 2. 이력에서 점검 항목명 추출
  const recentTypes = history.map(item => item.inspection_type);

  // 3. inspection_items에서 해당 항목들의 recommended_cycle 조회
  const { data: items, error: itemError } = await supabase
    .from('inspection_items')
    .select('title, recommended_cycle')
    .in('title', recentTypes);

  if (itemError) {
    console.error('❌ 점검 주기 정보 조회 실패:', itemError.message);
    return res.status(500).json({ message: '추천 주기 정보를 불러오지 못했습니다.', error: itemError });
  }

  // 4. 결과 구성
  const nextInspections = items.map(item => {
    const last = history.find(h => h.inspection_type === item.title);
    return {
      title: item.title,
      last_date: last?.date || '알 수 없음',
      recommended_cycle: item.recommended_cycle
    };
  });

  res.json({ nextInspections });
});

module.exports = router;
