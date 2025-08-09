// routes/nextInspections.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

/** 날짜 유틸: YYYY-MM-DD에 개월 더하기 */
function addMonths(isoDate, months) {
  if (!isoDate || months == null) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + months);
  // 월말 이슈 방지: setMonth가 말일 넘김 보정 시에도 ISO 슬라이스로 고정
  return d.toISOString().slice(0, 10);
}

/** recommended_cycle 폴백 파서(년/개월, 범위/단일, 혼합 일부) */
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

  // 단일 년(예: 2년, 1년마다)
  m = s.match(/(\d+)(년|y|yr|yrs|year|years)/i);
  if (m) return { monthsMin: +m[1] * 12, monthsMax: null };

  // 단일 개월(예: 12개월)
  m = s.match(/(\d+)(개월|month|months)/i);
  if (m) return { monthsMin: +m[1], monthsMax: null };

  return out;
}

/** cycle_spec 우선 사용, 없으면 recommended_cycle 문자열 파싱 */
function resolveMonths(cycleSpec, recommendedText) {
  if (cycleSpec && typeof cycleSpec === 'object') {
    const min = cycleSpec?.time?.minMonths ?? null;
    const max = cycleSpec?.time?.maxMonths ?? null;
    if (min != null || max != null) return { monthsMin: min, monthsMax: max };
  }
  return parseTextCycle(recommendedText);
}

// [GET] /api/next-inspection/:carNumber
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  // 1) 최근 점검 이력(최신 5건) - 기존 흐름 유지
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
  const recentTypes = history.map((item) => item.inspection_type);

  // 3) 주기 정보 조회(cycle_spec 포함) - 핵심 추가
  const { data: items, error: itemError } = await supabase
    .from('inspection_items')
    .select('title, recommended_cycle, cycle_spec')
    .in('title', recentTypes);

  if (itemError) {
    console.error('❌ 점검 주기 정보 조회 실패:', itemError.message);
    return res.status(500).json({ message: '추천 주기 정보를 불러오지 못했습니다.', error: itemError });
  }

  // 4) 결과 구성(+ 다음 점검일 계산)
  const nextInspections = items.map((item) => {
    const last = history.find((h) => h.inspection_type === item.title);
    const lastDate = last?.date || null;

    // 개월 범위 해석(cycle_spec 우선, 없으면 recommended_cycle 파싱)
    const { monthsMin, monthsMax } = resolveMonths(item.cycle_spec, item.recommended_cycle);

    const nextMin = lastDate && monthsMin != null ? addMonths(lastDate, monthsMin) : null;
    const nextMax = lastDate && monthsMax != null ? addMonths(lastDate, monthsMax) : null;

    // 단일/범위 판단: 최소만 있고 최대 없으면 단일
    const nextSingle = nextMin && !nextMax ? nextMin : null;

    return {
      title: item.title,
      last_date: lastDate || '알 수 없음',
      recommended_cycle: item.recommended_cycle,
      // 신규 필드: 프론트에서 이미 조건부 렌더 적용 중
      next_date: nextSingle,          // 단일 값
      next_date_min: nextMin,         // 범위 최소
      next_date_max: nextMax          // 범위 최대
      // 거리 기준(cycle_spec.distance)은 이번 라우트 목표 범위 밖(날짜만 표시)
    };
  });

  return res.json({ nextInspections });
});

module.exports = router;
