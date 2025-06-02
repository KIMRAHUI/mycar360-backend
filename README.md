# MyCar360 – 백엔드 API 서버

React 프론트엔드와 함께 동작하는 차량 점검 서비스의 백엔드입니다.  
Supabase(PostgreSQL)를 데이터베이스로 사용하며, Express를 통해 API를 제공합니다.

---

## 주요 기능

- 차량 점검 항목 전체 조회 및 카테고리별 필터
- 찜한 항목 추가/조회
- 차량별 점검 이력 조회 및 등록
- 점검 이력을 기반으로 다음 점검 항목 및 예상 시기 예측

---

## 기술 스택

| 항목 | 사용 기술 |
|------|-----------|
| 서버 환경 | Node.js, Express |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 키 관리 | dotenv (.env) |
| API 구조 | RESTful API |
| 배포 환경 | Render 또는 로컬 실행 |

---
```env
SUPABASE_URL=https://iijxoiiwptvfvmjqkeum.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpanhvaWl3cHR2ZnZtanFrZXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTUwNjksImV4cCI6MjA2MzQ5MTA2OX0.oZ9oigSGY9wSf5kffRug-tavbFb7tYc42lkBW6arIuU
PORT=5000

# 1. 의존성 설치
npm install

# 2. 서버 실행
node server.js
