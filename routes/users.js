// ✅ 필수 모듈 불러오기
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Supabase 연동 클라이언트

// ✅ GET /api/users/:id
// 사용자의 고유 id(primary key)를 기반으로 주소(address) 및 차량 종류(my_vehicle) 조회하는 라우트
router.get('/:id', async (req, res) => {
  const { id } = req.params; // URL 파라미터로 전달된 id 추출

  try {
    // Supabase에서 해당 id를 가진 사용자 레코드의 address, my_vehicle 필드 선택
    const { data, error } = await supabase
      .from('users')
      .select('address, my_vehicle') // ✅ 주소와 차량 종류 함께 조회
      .eq('id', Number(id)) // 숫자형으로 비교
      .single(); // 단일 객체로 반환 (없으면 error 발생)

    if (error) throw error;

    res.json({
      address: data.address,
      my_vehicle: data.my_vehicle, // ✅ 마이페이지에서 user.my_vehicle로 사용 가능
    });
  } catch (err) {
    console.error('❌ 사용자 정보 조회 실패:', err);
    res.status(500).json({ error: '사용자 정보 조회 실패' });
  }
});

// ✅ POST /api/users/:id/nickname
// 사용자의 닉네임(nickname)을 수정하는 라우트
router.post('/:id/nickname', async (req, res) => {
  const { id } = req.params;
  const { nickname } = req.body;

  if (!nickname || typeof nickname !== 'string') {
    return res.status(400).json({ error: '유효한 닉네임을 전달해주세요.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ nickname })
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, updatedNickname: data.nickname });
  } catch (err) {
    console.error('❌ 닉네임 업데이트 실패:', err);
    res.status(500).json({ error: '닉네임 업데이트 실패' });
  }
});

// ✅ 라우터 모듈 export
module.exports = router;
