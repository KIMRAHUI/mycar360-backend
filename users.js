// ✅ 필수 모듈 불러오기
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Supabase 연동 클라이언트

// ✅ GET /api/users/:id
// 사용자의 고유 id(primary key)를 기반으로 주소(address)만 조회하는 라우트
router.get('/:id', async (req, res) => {
  const { id } = req.params; // URL 파라미터로 전달된 id 추출

  try {
    // Supabase에서 해당 id를 가진 사용자 레코드의 address 필드만 선택
    const { data, error } = await supabase
      .from('users')
      .select('address') // 🎯 주소만 조회
      .eq('id', Number(id)) // 숫자형으로 비교
      .single(); // 단일 객체로 반환 (없으면 error 발생)

    // 에러 발생 시 예외 처리
    if (error) throw error;

    // 성공 시 주소 응답
    res.json({ address: data.address });
  } catch (err) {
    console.error('❌ 사용자 주소 조회 실패:', err);
    res.status(500).json({ error: '주소 조회 실패' });
  }
});

// ✅ 라우터 모듈 export
module.exports = router;
