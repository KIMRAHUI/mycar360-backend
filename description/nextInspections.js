// routes/nextInspections.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ===== 날짜 유틸 =====
function addMonths(isoDate, months) {
  if (!isoDate || months == null) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// recommended_cycle 문자열 폴백 파싱 (년/개월, 범위/단일, 혼합 일부)
function parseTextCycle(text = '') {
  const s = String(text).replace(/\s/g, '').toLowerCase();
  const out = { monthsMin: null, monthsMax: null };

  let m;
  // 2~3년 / 2-3년
  m = s.match(/(\d+)[~-](\d+)(년|y|yr|yrs|year|years)/i);
  if (m) return { monthsMin: +m[1] * 12, monthsMax: +m[2] * 12 };
  // 6개월~1년
  m = s.match(/(\d+)(개월|month|months)[~-](\d+)(년|y|year|years)/i);
  if (m) return { monthsMin: +m[1], monthsMax: +m[3] * 12 };
  // 24~36개월 / 24-36개월
  m = s.match(/(\d+)[~-](\d+)(개월|month|months)/i);
  if (m) return { monthsMin: +m[1], monthsMax: +m[2] };
  // 단일 년(2년, 1년마다)
  m = s.match(/(\d+)(년|y|yr|yrs|year|years)/i);
  if (m) return { monthsMin: +m[1] * 12, monthsMax: null };
  // 단일 개월(12개월)
  m = s.match(/(\d+)(개월|month|months)/i);
  if (m) return { monthsMin: +m[1], monthsMax: null };

  // 시간 정보가 없으면 null
  return { monthsMin: null, monthsMax: null };
}

// cycle_spec 우선 병합 파서
function resolveMonths(cycleSpec, recommendedText) {
  if (cycleSpec && typeof cycleSpec === 'object') {
    const min = cycleSpec?.time?.minMonths ?? null;
    const max = cycleSpec?.time?.maxMonths ?? null;
    if (min != null || max != null) {
      return { monthsMin: min, monthsMax: max };
    }
  }
  return parseTextCycle(recommendedText);
}

// ===== 라우트 =====
// [GET] /api/next-inspection/:carNumber
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  // 1) 최근 점검 이력 (기존 흐름 유지)
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

  // 2) 최근 이력의 점검 항목명 추출
  const recentTypes = history.map(item => item.inspection_type);

  // 3) inspection_items에서 주기 정보 조회 (cycle_spec 포함)
  const { data: items, error: itemError } = await supabase
    .from('inspection_items')
    .select('title, recommended_cycle, cycle_spec')
    .in('title', recentTypes);

  if (itemError) {
    console.error('❌ 점검 주기 정보 조회 실패:', itemError.message);
    return res.status(500).json({ message: '추천 주기 정보를 불러오지 못했습니다.', error: itemError });
  }

  // 4) 결과 구성 (+ 다음 점검일 계산)
  const nextInspections = items.map(item => {
    const last = history.find(h => h.inspection_type === item.title);
    const lastDate = last?.date || null;

    const { monthsMin, monthsMax } = resolveMonths(item.cycle_spec, item.recommended_cycle);

    const nextMin = (lastDate && monthsMin != null) ? addMonths(lastDate, monthsMin) : null;
    const nextMax = (lastDate && monthsMax != null) ? addMonths(lastDate, monthsMax) : null;

    // 단일/범위에 따라 next_date도 제공(단일일 때만)
    const nextSingle = nextMin && !nextMax ? nextMin : null;

    return {
      title: item.title,
      last_date: lastDate || '알 수 없음',
      recommended_cycle: item.recommended_cycle,

      // 신규 필드(프론트에서 선택적으로 사용)
      next_date: nextSingle,         // 단일값일 때만
      next_date_min: nextMin,        // 범위 사용 시 최소
      next_date_max: nextMax         // 범위 사용 시 최대
      // 주행거리 기준(cycle_spec.distance)은 이 라우트에선 계산 제외(지금 목표: 날짜 표시)
    };
  });

  res.json({ nextInspections });
});

module.exports = router;
