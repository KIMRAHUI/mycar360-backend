# 🔧 MyCar360 – 내 차량 점검 도우미 (Backend)

## 📌 개요
MyCar360은 차량 점검 초보자도 손쉽게 사용할 수 있는 차량 점검 기록 및 예측 웹 애플리케이션입니다.  
이 리포지토리는 Express.js 기반 백엔드 서버로, 사용자 인증, 찜 기능, 점검 이력 저장, 다음 점검 예측, Supabase 연동 API 등을 제공합니다.

---

## 🛠 기술 스택
- **Backend Framework**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (간단한 토큰 인증)
- **Deployment**: Render
- **API 연동**: Kakao Map API, Coupang 상품 링크 지원

---

## ✨ 주요 기능

### ✅ 사용자 인증 및 정보 관리
- 차량번호, 닉네임, 주소 기반 사용자 등록
- 인증번호 발송/검증 로직 (개발 단계에서는 `alert`)
- JWT 기반 인증 토큰 발급 (간단한 로그인 인증 흐름 유지)

### ✅ 점검 항목 API
- Supabase `inspection_items` 테이블에서 항목 검색, 상세 조회 지원
- 점검 주기, 부품, 비용, 설명 등을 포함한 실데이터 기반 구성

### ✅ 찜 기능 (Favorites)
- `/api/favorites/:userId` – 유저의 찜 목록 조회
- `/api/favorites` – 찜 등록/해제
- Supabase `favorites` 테이블 연동

### ✅ 점검 이력 저장 및 조회
- `/api/history` – 점검 이력 추가
- `/api/history/:carNumber` – 해당 차량 이력 조회
- `/api/history/delete/:id` – 이력 삭제
- 이력 항목: 항목명, 날짜, 장소, 메모, 지도 위치 포함

### ✅ 다음 점검 예측 API
- `/api/next-inspection/:carNumber`  
  → 해당 차량의 점검 이력을 분석하여, 주기 기반으로 다음 점검 시기 및 항목을 예측
- 별도의 테이블 생성 없이 `inspection_items` + `inspection_history`를 조합하여 계산

### 🌟 추천 정비소 제공 (2025-06 추가)
- `/api/recommended-shops`  
  → Supabase `recommended_shops` 테이블에서 추천 정비소 목록 반환
- 좌측 슬라이딩 UI와 연동되는 JSON 포맷 제공  
  (이미지, 주소, 전화번호, 평점, 태그 포함)

---

## 📂 디렉토리 구조
```
backend/
┣ routes/
┃ ┣ auth.js # 사용자 인증 및 회원가입
┃ ┣ favorites.js # 찜 기능 관련 API
┃ ┣ history.js # 점검 이력 API
┃ ┣ next-inspection.js # 다음 점검 예측 API
┃ ┗ recommendedShops.js # 추천 정비소 API (신규)
┣ supabaseClient.js # Supabase 클라이언트 연결 모듈
┣ server.js # Express 서버 진입점
┣ mycar360.sql # 테이블 구조 및 초기 데이터 (Supabase용)
┣ .env # 환경 변수 설정
┣ package.json # 의존성 설정
┗ README.md # 백엔드 설명 문서
```

---

## 🔌 주요 API 엔드포인트 정리

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST   | `/api/auth/signup`             | 사용자 등록 (차량번호 기반) |
| POST   | `/api/auth/verify`             | 인증번호 검증 |
| GET    | `/api/favorites/:userId`       | 찜 목록 조회 |
| POST   | `/api/favorites`               | 찜 등록/해제 |
| GET    | `/api/history/:carNumber`      | 차량 점검 이력 조회 |
| POST   | `/api/history`                 | 점검 이력 추가 |
| DELETE | `/api/history/delete/:id`      | 점검 이력 삭제 |
| GET    | `/api/next-inspection/:carNumber` | 다음 점검 항목/날짜 예측 |
| GET    | `/api/recommended-shops`       | 추천 정비소 목록 조회 (이미지 포함) |

---

## 🚀 배포 방법 (Render 기준)

1. Render에 Node.js 앱 생성
2. `Build Command`: `npm install`
3. `Start Command`: `node server.js`
4. 환경 변수 등록 (Settings → Environment Variables):
   - `SUPABASE_URL` → https://iijxoiiwptvfvmjqkeum.supabase.co
   - `SUPABASE_KEY` → Supabase 서비스 키 (절대 외부 노출 금지)
   - `JWT_SECRET` → JWT 서명용 사용자 지정 키 (예: super_secret_360)
5. CORS 허용:
   - Allowed Origin에 `https://your-frontend.vercel.app` 추가

---

## 📌 보안 및 향후 개선점

- 인증번호 로직은 현재 개발용 (`console.alert`)이며, 추후 SMS API 연동 가능
- `.env` 파일은 GitHub에 절대 커밋하지 않도록 `.gitignore`에 포함
- Supabase `service_role_key`와 `JWT_SECRET`은 반드시 비공개 환경 변수로 관리
- 향후 개선 방향:
  - Express 미들웨어 분리, 유효성 검사 추가
  - rate-limiting, JWT refresh 토큰 적용 등 보안 강화

---

## 🧠 어필 포인트

| 항목 | 설명 |
|------|------|
| ✅ Supabase 구조 설계 | 사용자, 점검 항목, 찜, 이력, 추천 정비소 테이블 모두 직접 설계 |
| ✅ Express API 직접 구현 | 실제 동작하는 RESTful API 다수 구현 |
| ✅ 실제 데이터 분석 기반 예측 | 기존 이력/주기만으로 다음 점검 예측 |
| ✅ 지도 기반 추천 기능 | 추천 정비소 데이터 → Kakao Map 연동 및 좌측 슬라이드 UI 완성 |
| ✅ 배포 경험 | Render 배포 및 CORS, 환경변수 처리 경험 |

---

## 🧾 데이터베이스 초기화 SQL

- [`sqld/supabase.sql`](./sqld/supabase.sql): Supabase 전용 PostgreSQL 스키마, Supabase에서 사용되는 테이블 및 초기 데이터 정의
- [`sqld/mysql.sql`](./sqld/mysql.sql): 로컬 MySQL/MariaDB 전용 스키마
