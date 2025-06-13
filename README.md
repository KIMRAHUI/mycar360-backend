물론입니다. 아래는 기존 백엔드 리드미에 **오늘 작업한 내용**을 반영하여 *전체 덮어쓰기용 최신 버전*으로 구성한 내용입니다. 추가된 주요 항목은 **점검이력과 교체부품 일치 검증 로직**, **추천 정비소 마커 클릭 연동**, **추천 정비소 테이블 및 데이터 구조 설명**입니다:

---

# 🔧 MyCar360 – 내 차량 점검 도우미 (Backend)

## 📌 개요

**MyCar360**은 차량 점검 초보자도 손쉽게 사용할 수 있는 차량 점검 기록 및 예측 웹 애플리케이션입니다.
이 리포지토리는 Express.js 기반 백엔드 서버로, 사용자 인증, 찜 기능, 점검 이력 저장, 다음 점검 예측, 정비소 추천 API, Supabase 연동 등을 제공합니다.

---

## 🛠 기술 스택

* **Backend Framework**: Express.js (Node.js)
* **Database**: Supabase (PostgreSQL)
* **Authentication**: JWT (간단한 토큰 인증)
* **Deployment**: Render
* **API 연동**: Kakao Map API, Coupang 상품 링크

---

## ✨ 주요 기능

### ✅ 사용자 인증 및 정보 관리

* 차량번호, 닉네임, 주소 기반 사용자 등록
* 인증번호 발송/검증 로직 (`alert` 기반, 개발 단계 한정)
* JWT 기반 인증 토큰 발급

### ✅ 점검 항목 API

* `inspection_items` 테이블 조회 (검색, 상세 정보 포함)
* 항목별 주기, 부품, 비용, 설명 등 포함된 실데이터 구성

### ✅ 찜 기능 (Favorites)

* `/api/favorites/:userId` – 유저의 찜 목록 조회
* `/api/favorites` – 찜 등록/해제 API
* Supabase `favorites` 테이블과 연동

### ✅ 점검 이력 저장 및 조회

* `/api/history` – 점검 이력 추가
* `/api/history/:carNumber` – 해당 차량 이력 조회
* `/api/history/delete/:id` – 이력 삭제
* 각 이력 항목에는 항목명, 날짜, 장소, 메모, 지도 위치 포함
* ✅ **이력 저장 시 해당 항목의 `parts` 값과 사용자 입력 부품이 일치하는지 검증 추가 (2025-06-13)**

### ✅ 다음 점검 예측 API

* `/api/next-inspection/:carNumber`
  → 점검 이력을 바탕으로 주기 기반 다음 점검 항목 및 날짜 예측
* `inspection_items` + `inspection_history`만으로 계산 (추가 테이블 없음)

### 🌟 추천 정비소 제공 (2025-06 추가)

* `/api/recommended-shops` → 추천 정비소 목록 반환
* Supabase `recommended_shops` 테이블 기반
* 이미지, 주소, 전화번호, 평점, 태그 포함된 JSON 형식 반환
* ✅ 마커 클릭 시 지도 중심 이동 및 선택 상태에 따라 마커 색상 변경 (노란색 → 주황색), InfoWindow 표시 포함

---

## 📂 디렉토리 구조

```
backend/
┣ routes/
┃ ┣ auth.js               # 사용자 인증/회원가입
┃ ┣ favorites.js          # 찜 기능 API
┃ ┣ history.js            # 점검 이력 API (+ parts 일치 검증 포함)
┃ ┣ next-inspection.js    # 다음 점검 예측 API
┃ ┗ recommendedShops.js   # 추천 정비소 API
┣ supabaseClient.js       # Supabase 연결 설정
┣ server.js               # 서버 진입점
┣ mycar360.sql            # Supabase 초기 테이블 + 데이터
┣ .env                    # 환경 변수
┣ package.json            # 의존성
┗ README.md               # 백엔드 설명 문서
```

---

## 🔌 주요 API 엔드포인트 정리

| Method | Endpoint                          | 설명                     |
| ------ | --------------------------------- | ---------------------- |
| POST   | `/api/auth/signup`                | 사용자 등록 (차량번호 기반)       |
| POST   | `/api/auth/verify`                | 인증번호 검증                |
| GET    | `/api/favorites/:userId`          | 찜 목록 조회                |
| POST   | `/api/favorites`                  | 찜 등록/해제                |
| GET    | `/api/history/:carNumber`         | 차량 점검 이력 조회            |
| POST   | `/api/history`                    | 점검 이력 추가 (부품 일치 검증 포함) |
| DELETE | `/api/history/delete/:id`         | 점검 이력 삭제               |
| GET    | `/api/next-inspection/:carNumber` | 다음 점검 항목/날짜 예측         |
| GET    | `/api/recommended-shops`          | 추천 정비소 목록 조회           |

---

## 🚀 배포 방법 (Render 기준)

1. Render에서 Node.js 앱 생성
2. **Build Command**: `npm install`
3. **Start Command**: `node server.js`
4. **환경 변수 등록**:

   * `SUPABASE_URL`: `https://iijxoiiwptvfvmjqkeum.supabase.co`
   * `SUPABASE_KEY`: Supabase 서비스 키 (비공개 필수)
   * `JWT_SECRET`: 예: `super_secret_360`
5. **CORS 허용 설정**:

   * Allowed Origin에 프론트 배포 주소 추가 (e.g., `https://mycar360.vercel.app`)

---

## 🧾 데이터베이스 테이블 요약 (Supabase 기준)

### 🔹 `users`

| 필드          | 설명                 |
| ----------- | ------------------ |
| id (UUID)   | Supabase 고유 사용자 ID |
| car\_number | 차량 번호              |
| nickname    | 닉네임                |
| address     | 주소                 |
| created\_at | 가입 일시              |

### 🔹 `inspection_items`

| 필드                 | 설명         |
| ------------------ | ---------- |
| id                 | 항목 ID      |
| title              | 점검 항목명     |
| description        | 설명         |
| recommended\_cycle | 추천 주기 (일수) |
| parts              | 부품명        |
| cost\_range        | 예상 비용      |

### 🔹 `inspection_history`

| 필드          | 설명        |
| ----------- | --------- |
| id          | 이력 ID     |
| car\_number | 차량 번호     |
| item\_id    | 점검 항목 ID  |
| item\_name  | 항목명       |
| date        | 점검일       |
| location    | 장소        |
| parts\_used | 실제 교체한 부품 |
| memo        | 메모        |
| lat / lng   | 위치 좌표     |

### 🔹 `favorites`

| 필드       | 설명       |
| -------- | -------- |
| id       | 찜 ID     |
| user\_id | 사용자 ID   |
| item\_id | 점검 항목 ID |

### 🔹 `recommended_shops` (🆕 2025-06 도입)

| 필드         | 설명                        |
| ---------- | ------------------------- |
| id         | 고유 ID                     |
| name       | 정비소 이름                    |
| address    | 주소                        |
| phone      | 전화번호                      |
| image\_url | 썸네일 이미지                   |
| rating     | 평점 (예: 4.8)               |
| tags       | 관련 태그 (예: \["엔진", "배터리"]) |
| lat / lng  | 지도 좌표                     |

---

## 🧠 어필 포인트

| 항목                 | 설명                                         |
| ------------------ | ------------------------------------------ |
| ✅ Supabase 설계 경험   | 사용자, 점검 항목, 이력, 찜, 추천 정비소 전체 테이블 직접 구성     |
| ✅ Express.js 직접 구현 | CRUD 기반 REST API 다수 구현                     |
| ✅ 실데이터 기반 예측       | 점검 이력과 주기 기반으로 다음 점검 항목 예측                 |
| ✅ Kakao Map 커스터마이징 | 지도 중심 이동, 마커 클릭 시 색상 변경 및 InfoWindow 연동 완성 |
| ✅ 배포 및 보안 경험       | Render 배포, 환경 변수 처리, 인증 키 관리 경험            |

---

## 🔐 보안 및 개선 방향

* 인증번호 발송은 개발용 alert 사용 → SMS API로 향후 전환 고려
* `.env` 파일은 `.gitignore`에 반드시 포함
* Supabase `service_role_key`, `JWT_SECRET`은 외부에 절대 노출 금지
* 향후 보완 예정:

  * 입력값 유효성 검증
  * 미들웨어 구조화
  * JWT refresh 토큰 적용
  * 요청 속도 제한 (rate-limit) 도입 등

---


