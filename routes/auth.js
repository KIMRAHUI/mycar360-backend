// routes/auth.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// 메모리 임시 저장소 (실제론 Redis 등 사용 권장)
const authCodes = new Map(); // { phone_number: code }

// 1) 인증번호 발송 (회원가입, 로그인 시도 모두 여기에)
router.post('/signup', async (req, res) => {
  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ message: '핸드폰 번호 필요' });

  // 인증번호 생성 (6자리 랜덤)
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // (실제론 문자 발송 API 호출 코드 삽입)
  console.log(`인증번호 [${code}] 를 ${phone_number}로 발송`);

  // 메모리 저장 (5분 유효)
  authCodes.set(phone_number, code);
  setTimeout(() => authCodes.delete(phone_number), 5 * 60 * 1000);

  res.json({ message: '인증번호가 발송되었습니다.' });
});

// 2) 인증번호 확인 및 토큰 발급 (로그인, 회원가입 용도 겸용)
router.post('/verify', async (req, res) => {
  const { phone_number, code, nickname, car_number } = req.body;
  if (!phone_number || !code) return res.status(400).json({ message: '핸드폰 번호 및 인증번호 필요' });

  const savedCode = authCodes.get(phone_number);
  if (!savedCode || savedCode !== code) {
    return res.status(401).json({ message: '인증번호가 일치하지 않습니다.' });
  }

  // 인증번호 맞으면 삭제
  authCodes.delete(phone_number);

  // 사용자 존재 여부 확인
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', phone_number);

  if (error) return res.status(500).json({ message: 'DB 오류', error });

  let user = users && users.length > 0 ? users[0] : null;

  // 신규 사용자일 경우 회원가입 (car_number, nickname 필수)
  if (!user) {
    if (!car_number || !nickname) {
      return res.status(400).json({ message: '신규 가입 시 차량번호와 닉네임 필요' });
    }
    const { data, error: insertErr } = await supabase
      .from('users')
      .insert([{ car_number, nickname, phone_number, verified: true }])
      .select();
    if (insertErr) return res.status(500).json({ message: '회원가입 실패', error: insertErr });
    user = data[0];
  }

  // JWT 토큰 생성 (예: user id, 닉네임, 차량번호 포함)
  const token = jwt.sign({
    id: user.id,
    nickname: user.nickname,
    car_number: user.car_number,
    phone_number: user.phone_number
  }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user });
});

// 3) 토큰 검증 후 사용자 정보 반환 (예: 마이페이지용)
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: '토큰이 필요합니다.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰 형식이 잘못되었습니다.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // 필요시 DB에서 최신 사용자 정보 조회
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id);

    if (error) return res.status(500).json({ message: 'DB 오류', error });
    if (!users || users.length === 0) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    res.json(users[0]);
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.', error: err.message });
  }
});

module.exports = router;
