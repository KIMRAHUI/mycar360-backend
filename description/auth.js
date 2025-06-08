// ✅ 필수 모듈 로드
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Supabase 클라이언트
const jwt = require('jsonwebtoken');

// 서버 실행 시 라우트 파일이 불러와졌는지 확인
console.log('✅ auth.js 라우트 파일 불러와짐');

// JWT 발급에 사용할 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ✅ 서버 정상 작동 테스트용 라우트
router.get('/test', (req, res) => {
  res.send('✅ /api/auth 라우트 정상 작동 중');
});

// 🔐 인증번호 저장소 (메모리 기반)
const authCodes = new Map(); // { '01012345678': '325394' }

// ✅ 1단계: 인증번호 요청 (가입 시)
router.post('/signup', async (req, res) => {
  const { phone_number } = req.body;
  console.log('[POST /signup] 요청 본문:', req.body);

  if (!phone_number) {
    return res.status(400).json({ message: '핸드폰 번호가 필요합니다.' });
  }

  // 6자리 랜덤 인증번호 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`📨 [개발용] 인증번호 [${code}] → ${phone_number}`);

  // 인증번호 저장 (유효 시간 5분)
  authCodes.set(phone_number, code);
  setTimeout(() => {
    authCodes.delete(phone_number);
    console.log(`🕒 인증번호 만료 처리 완료: ${phone_number}`);
  }, 5 * 60 * 1000);

  // 개발용으로 코드도 같이 응답
  res.json({ message: '인증번호가 발송되었습니다. (개발용)', code });
});

// ✅ 2단계: 인증번호 확인 및 회원가입 or 로그인
router.post('/verify', async (req, res) => {
  const {
    phone_number,
    code,
    nickname,
    car_number,
    address,
    telco,
    vehicle_type, // 차량 유형 (선택 입력)
  } = req.body;

  console.log('[POST /verify] 요청 본문:', req.body);

  const savedCode = authCodes.get(phone_number);
  console.log('✔️ 저장된 인증번호:', savedCode, '/ 입력한 코드:', code);

  // 인증번호 만료 또는 없음
  if (!savedCode) {
    return res.status(401).json({ message: '인증번호가 만료되었거나 존재하지 않습니다.' });
  }

  // 인증번호 불일치
  if (savedCode !== code) {
    console.warn('❌ 인증번호 불일치');
    return res.status(401).json({ message: '인증번호가 일치하지 않습니다.' });
  }

  // 인증 완료 → Map에서 제거
  authCodes.delete(phone_number);
  console.log(`✅ 인증번호 일치 확인 완료: ${phone_number}`);

  try {
    // 기존 사용자 존재 여부 확인
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone_number);

    if (error) {
      console.error('❌ DB 조회 오류:', error);
      return res.status(500).json({ message: 'DB 조회 오류', error });
    }

    let user = users.length > 0 ? users[0] : null;

    // 신규 사용자면 → 회원가입
    if (!user) {
      // 필수 입력값 체크
      if (!car_number || !nickname) {
        return res.status(400).json({ message: '차량번호와 닉네임이 필요합니다.' });
      }

      // 차량 정보가 vehicle_info 테이블에 있는지 확인
      const { data: vehicleExists, error: vehicleCheckErr } = await supabase
        .from('vehicle_info')
        .select('*')
        .eq('car_number', car_number);

      if (vehicleCheckErr) {
        return res.status(500).json({ message: '차량 정보 확인 실패', error: vehicleCheckErr });
      }

      // 없으면 신규 차량 등록
      if (!vehicleExists || vehicleExists.length === 0) {
        const { error: insertVehicleErr } = await supabase
          .from('vehicle_info')
          .insert([
            {
              car_number,
              type: vehicle_type || '미등록 차량',
              year: '2025',
              parts: '[]', // JSON 형태 문자열
              history: '[]',
            },
          ]);
        if (insertVehicleErr) {
          return res.status(500).json({ message: '차량 정보 등록 실패', error: insertVehicleErr });
        }
        console.log(`🆕 차량 정보 등록 완료: ${car_number}`);
      }

      // 사용자 테이블에 신규 등록
      console.log('📦 사용자 등록 시도 중:');
      console.log({ car_number, nickname, phone_number, address, telco, vehicle_type });

      const { data, error: insertErr } = await supabase
        .from('users')
        .insert([
          {
            car_number,
            nickname,
            phone_number,
            address,
            telco,
            vehicle_type,
            verified: true,
          },
        ])
        .select();

      if (insertErr) {
        console.error('❌ 사용자 등록 실패:', insertErr);
        return res.status(500).json({ message: '회원가입 실패', error: insertErr });
      }

      user = data[0];
      console.log('🆕 신규 사용자 등록 성공:', user);
    } else {
      // 이미 존재하는 사용자 로그인
      console.log('👤 기존 사용자 로그인:', user);
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      {
        id: user.id,
        nickname: user.nickname,
        car_number: user.car_number,
        phone_number: user.phone_number,
      },
      JWT_SECRET,
      { expiresIn: '7d' } // 7일간 유효
    );

    console.log('🔐 JWT 발급 완료, 사용자 응답 전송');
    res.json({ token, user });
  } catch (err) {
    console.error('[POST /verify] 내부 오류:', err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// ✅ 사용자 프로필 조회 (토큰 필요)
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '토큰 형식이 잘못되었습니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id);

    if (error) {
      return res.status(500).json({ message: 'DB 오류', error });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json(users[0]);
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.', error: err.message });
  }
});

// ✅ 차량 번호로 사용자 조회
router.get('/user-by-car/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('car_number', carNumber);

  if (error) {
    console.error('❌ 차량번호로 사용자 조회 실패:', error);
    return res.status(500).json({ message: 'DB 오류', error });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: '해당 차량의 사용자 정보 없음' });
  }

  res.json(data[0]);
});

// ✅ 전체 라우터 내보내기
module.exports = router;
