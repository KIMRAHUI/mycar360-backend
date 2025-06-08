// routes/userByCar.js

// ✅ Express 및 Supabase 클라이언트 불러오기
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Supabase 연동 클라이언트

// ✅ [GET] /api/user-by-car/:carNumber
// 차량 번호(car_number)를 기준으로 사용자 정보를 조회하는 API
router.get('/:carNumber', async (req, res) => {
  const { carNumber } = req.params; // URL 파라미터에서 차량 번호 추출

  try {
    // Supabase에서 car_number가 일치하는 사용자 레코드 전체 조회
    const { data, error } = await supabase
      .from('users') // users 테이블 대상으로
      .select('*')   // 전체 필드 조회
      .eq('car_number', decodeURIComponent(carNumber)) // URI 인코딩 된 차량번호 디코드 후 비교
      .single(); // 결과를 단일 객체로 반환 (복수면 에러)

    // 데이터가 없거나 오류 발생 시 404 응답
    if (error || !data) {
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 조회된 사용자 정보 응답
    res.json(data);
  } catch (err) {
    // 예기치 못한 서버 오류 처리
    console.error('❌ 사용자 조회 실패:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// ✅ 라우터 모듈 export
module.exports = router;
