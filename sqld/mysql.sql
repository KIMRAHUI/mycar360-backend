-- 1. 기존 테이블 모두 삭제 (외래키 의존성 고려해 순서대로)
DROP TABLE IF EXISTS inspection_history;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS inspection_items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS vehicle_info;
DROP TABLE IF EXISTS recommended_shops;

-- 2. 차량 정보 테이블 생성
CREATE TABLE vehicle_info (
  car_number VARCHAR(20) PRIMARY KEY,
  type VARCHAR(100),
  year VARCHAR(10),
  parts JSON,
  history JSON
);

-- 3. 사용자 정보 테이블 생성
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  car_number VARCHAR(20) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  telco VARCHAR(10),
  phone_number VARCHAR(20),
  address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_number) REFERENCES vehicle_info(car_number) ON DELETE CASCADE
);

-- 4. 점검 항목 테이블 생성
CREATE TABLE inspection_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  recommended_cycle TEXT,
  parts TEXT,
  cost_range TEXT,
  warning_light TEXT,
  detail TEXT,
  images JSON
);

-- 5. 찜 테이블 생성
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  inspection_item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, inspection_item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (inspection_item_id) REFERENCES inspection_items(id) ON DELETE CASCADE
);

-- 6. 점검 이력 테이블 생성
CREATE TABLE inspection_history (
  id CHAR(36) PRIMARY KEY,
  car_number VARCHAR(20) NOT NULL,
  inspection_type TEXT NOT NULL,
  shop_name TEXT,
  date DATE NOT NULL,
  note TEXT,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type ENUM('점검', '교체') NOT NULL
);

-- 7. 추천 정비소 테이블 생성
CREATE TABLE recommended_shops (
  id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE NOT NULL,
  lng DOUBLE NOT NULL,
  tags JSON,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(3,1),
  phone TEXT
);


-- 7. 차량 정보 더미 데이터 삽입
INSERT INTO vehicle_info (car_number, type, year, parts, history) VALUES
('12가2346', '현대 그랜저 IG', '2021',
  '[{"partName": "배터리", "replacedAt": "2024-03"}, {"partName": "타이어", "replacedAt": "2023-11"}]',
  '[{"label": "정기점검", "performedAt": "2024-01"}, {"label": "엔진오일", "performedAt": "2023-08"}]'
),
('12가3456', 'Hyundai Elantra N', '2022',
  '[{"partName": "에어컨 필터 교체", "replacedAt": "2025-06-14"}, {"partName": "타이어 교체", "replacedAt": "2023-09-13"}, {"partName": "엔진오일 교체", "replacedAt": "2023-08-07"}]',
  '[{"label": "배터리 점검", "performedAt": "2025-02-10"}]'
),
('34나5678', 'Kia K5', '2020',
  '[{"partName": "브레이크패드", "replacedAt": "2023-10"}, {"partName": "냉각수 보충", "replacedAt": "2023-07"}]',
  '[{"label": "정기점검", "performedAt": "2023-12"}, {"label": "하체 점검", "performedAt": "2023-11"}]'
);


-- 8. 점검 항목 데이터 삽입 (20개 예시)
INSERT INTO inspection_items (title, category, description, image_url, recommended_cycle, parts, cost_range, warning_light, detail) VALUES
('엔진오일 교체', '기본점검', '주기적으로 엔진오일을 교체하여 엔진 성능 유지', '', '5,000~10,000km', '엔진오일, 오일필터', '5~10만원', '엔진 경고등', '정기적으로 교체하여 엔진 마모와 손상을 방지하고 수명을 연장합니다.'),
('에어컨 필터 교체', '계절점검', '차내 공기 질 향상을 위해 필터 정기 교체 필요', '', '12개월 또는 15,000km', '에어컨 필터', '2~4만원', NULL, '차내 공기질 향상을 위해 정기적으로 교체가 필요합니다.'),
('타이어 공기압 점검', '장거리점검', '주행 전/후 타이어 공기압을 점검하여 안전 확보', '', '한 달에 1회 이상', '타이어 공기압 센서', '0원 (자가점검)', NULL, '공기압 부족 시 사고 위험이 높아지므로 정기 확인 필요'),
('배터리 점검', '계절점검', '시동 지연이나 경고등 점등 시 배터리 성능 확인', '', '2~3년마다', '배터리', '10~20만원', '배터리 경고등', '시동 불량, 전압 문제 발생 시 즉시 점검'),
('브레이크 패드 점검', '기본점검', '소음 또는 밀림 현상 발생 시 점검 필요', '', '20,000~40,000km', '브레이크 패드', '8~15만원', '브레이크 경고등', '마모 시 제동거리 증가, 안전 위해 정기 교체 필요'),
('하체 점검', '장거리점검', '승차감 및 조향 안정성 확보를 위한 점검', '', '정기점검 시 함께', '서스펜션, 링크부품', '10~30만원', NULL, '노면 충격 흡수력, 조향 안정성을 위한 핵심 부위'),
('정기 종합검사', '기본점검', '법적 의무사항인 정기검사', '', '2년마다', '차량 전체', '5~10만원', NULL, '정부 지정 검사소에서 필수로 진행되는 정기 종합검사'),
('냉각수 보충', '계절점검', '엔진 과열 방지를 위한 필수 점검 항목', '', '6개월~1년', '냉각수', '2~5만원', '온도 경고등', '계절 전 점검 권장'),
('엔진룸 청소', '기본점검', '엔진의 청결 유지 및 먼지 제거', '', '필요 시', '엔진룸', '1~3만원', NULL, '먼지, 기름때로 오염된 엔진룸 주기적 청소'),
('타이어 교체', '장거리점검', '마모율이 높을 경우 즉시 교체 필요', '', '마모 시', '타이어', '30~60만원(4개 기준)', NULL, '마모율이 높거나 균열 있을 경우 즉시 교체'),
('브레이크 오일 점검', '기본점검', '제동력 저하 방지 위해 점검 필요', '', '2년마다', '브레이크 오일', '3~6만원', NULL, '브레이크 계통 보호 위한 필수 점검'),
('전조등 점검', '계절점검', '야간 주행 시 시야 확보 필수', '', '정기점검 시', '전조등', '1~3만원', '전조등 경고등', '야간 주행 시 정기 점검 필요'),
('미션오일 교체', '장거리점검', '변속 충격 완화 및 수명 연장 목적', '', '40,000~80,000km', '미션오일', '15~25만원', NULL, '자동변속기 수명 연장 위해 교체 필요'),
('와이퍼 교체', '계절점검', '우천 시 시야 확보를 위한 소모품', '', '1~2년', '와이퍼', '1~2만원', NULL, '우천 시 시야 확보 위해 마모 전 교체 필요'),
('연료 필터 점검', '장거리점검', '연료 공급 안정성 확보', '', '2년 또는 40,000km', '연료 필터', '5~10만원', NULL, '연료 흐름 안정성과 이물질 제거 점검'),
('클러치 작동 점검', '장거리점검', '수동 변속기의 핵심 요소 유지 관리', '', '이상 발생 시', '클러치 디스크', '20~30만원', NULL, '변속 충격 또는 소음 발생 시 점검'),
('휠 얼라인먼트', '장거리점검', '타이어 수명 연장 및 주행 안정성 확보', '', '정렬 이상 시', '서스펜션, 휠', '3~6만원', NULL, '핸들 쏠림, 편마모 방지 위한 정렬 작업'),
('에어컨 가스 보충', '계절점검', '여름철 냉방 성능 유지', '', '2~3년마다', '냉매 가스', '5~8만원', NULL, '냉방 성능 유지 위한 가스 보충'),
('스파크 플러그 점검', '기본점검', '점화 불량 방지 및 연비 개선', '', '30,000km', '스파크 플러그', '4~8만원', NULL, '시동불량, 연비 저하 방지 위해 정기 교체'),
('타이어 위치 교환', '장거리점검', '편마모 방지 및 수명 연장', '', '10,000~15,000km', '타이어', '0~5만원', NULL, '주기적으로 앞뒤 위치 교체');

-- 9. 사용자 데이터 삽입
INSERT INTO users (car_number, nickname, telco, phone_number, address, verified) VALUES
('12가3456', '포카칩', 'SKT', '01012345678', '서울시 강남구', TRUE),
('34나5678', '달콤이', 'KT', '01087654321', '서울시 서초구', FALSE),
('12가2346', '바람개비', 'LGU+', '01055556666', '서울시 송파구', TRUE);

-- 10. 점검 이력 데이터 삽입
INSERT INTO inspection_history (id, car_number, inspection_type, shop_name, date, note, user_id, created_at, type) VALUES
(1, '12가3456', '엔진오일 교체', '현대오토큐 강남점', '2023-08-07', '주행거리 8,000km 도달로 교체', 1, '2025-06-11 05:47:23', '교체'),
(2, '12가3456', '배터리 점검', '카센터 강동점', '2025-02-10', '시동 지연 문제로 점검', 1, '2025-06-11 05:47:23', '점검'),
(3, '12가3456', '타이어 교체', '타이어프로 삼성점', '2023-09-13', '앞바퀴 마모 확인 후 교체', 1, '2025-06-11 05:47:23', '교체'),
(17, '12가3456', '에어컨 필터 교체', '블루핸즈 두산점', '2025-06-14', '여름맞이 필터교체', 1, '2025-06-13 15:54:42', '교체');


-- 11. 찜 데이터 삽입
INSERT INTO favorites (user_id, inspection_item_id) VALUES
(1, 3),
(1, 4),
(1, 5);

-- 🔧 inspection_items 테이블에 images 컬럼 추가 (MySQL은 JSON 사용)
ALTER TABLE inspection_items ADD COLUMN images JSON;

-- 🔁 각 점검 항목별 이미지 경로 업데이트
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/1.jpg", "/images/inspection/1-1.jpg") WHERE id = 1;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/2.jpg", "/images/inspection/2-1.jpg") WHERE id = 2;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/3.jpg", "/images/inspection/3-1.jpg") WHERE id = 3;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/4.jpg", "/images/inspection/4-1.jpg") WHERE id = 4;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/5.jpg", "/images/inspection/5-1.jpg") WHERE id = 5;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/6.jpg", "/images/inspection/6-1.jpg") WHERE id = 6;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/8.jpg", "/images/inspection/8-1.jpg") WHERE id = 8;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/9.jpg", "/images/inspection/9-1.jpg") WHERE id = 9;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/10.jpg", "/images/inspection/10-1.jpg") WHERE id = 10;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/11.jpg", "/images/inspection/11-1.jpg") WHERE id = 11;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/12.jpg", "/images/inspection/12-1.jpg") WHERE id = 12;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/13.jpg", "/images/inspection/13-1.jpg") WHERE id = 13;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/14.jpg", "/images/inspection/14-1.jpg") WHERE id = 14;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/15.jpg", "/images/inspection/15-1.jpg") WHERE id = 15;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/16.jpg", "/images/inspection/16-1.jpg") WHERE id = 16;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/17.jpg", "/images/inspection/17-1.jpg") WHERE id = 17;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/18.jpg", "/images/inspection/18-1.jpg") WHERE id = 18;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/19.jpg", "/images/inspection/19-1.jpg") WHERE id = 19;
UPDATE inspection_items SET images = JSON_ARRAY("/images/inspection/20.jpg", "/images/inspection/20-1.jpg") WHERE id = 20;


-- ✅ 1. 추천 정비소 테이블 생성
CREATE TABLE IF NOT EXISTS recommended_shops (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  tags JSON,
  description TEXT,
  image_url TEXT,
  rating NUMERIC(2,1),
  phone TEXT
);

-- ✅ 2. 추천 정비소 데이터 삽입
INSERT INTO "public"."recommended_shops" (
  "id", "name", "address", "lat", "lng", "tags", "description", "image_url", "rating", "phone"
) VALUES
('91d981ab-42ee-4b33-b379-116d14579e32', '불스원 강남점', '서울 강남구 테헤란로 123', 37.501274, 127.039585, '["합리적 가격", "친절 서비스"]', '불스원 강남 공식 지정점', '/images/shops/bullsone_gangnam.jpg', 4.7, '02-123-4567'),
('6f3f1de7-dc0d-4c64-9ba3-d38048be80ff', '현대오토큐 백록점', '서울 중구 퇴계로 123', 37.560432, 126.994927, '["정품 부품", "빠른 수리"]', '현대자동차 공식 서비스', '/images/shops/hyundai_autoq.jpg', 4.5, '02-234-5678'),
('23cda547-ff32-4652-bd62-926ce11dc2b9', '스피드메이트 백록', '서울 용산구 한강대로 50', 37.529582, 126.967907, '["예약 가능", "신속 점검"]', '스피드메이트 용산 직영점', '/images/shops/speedmate_baeknok.jpg', 4.6, '02-345-6789'),
('ef1395c7-f6df-4d55-9d6e-2bfa4a3ed3f0', '카닥 서비스 강동', '서울 강동구 천호대로 100', 37.538414, 127.123032, '["친절 응대", "청결한 시설"]', '카닥 공식 지정 정비소', '/images/shops/cardoc_gangdong.jpg', 4.4, '02-456-7890'),
('9bb0e38a-239b-4e61-a62b-00a733ae41e3', '에이원카센터 강서', '서울 강서구 화곡로 30', 37.541278, 126.840674, '["합리적 가격", "보증 수리"]', '지역 주민 추천 1위 정비소', '/images/shops/aonecarcenter.jpg', 4.6, '02-567-8901'),
('fbc3ed5c-5e4b-4b9e-88dc-8d8bc254fc85', '탑카센터 도봉', '서울 도봉구 도봉로 10', 37.664377, 127.032726, '["전문 기술자", "장기 고객"]', '도봉 대표 자동차 수리 전문점', '/images/shops/topcar_dobong.jpg', 4.5, '02-678-9012'),
('a1d3d830-6792-4c6c-b28d-587b5797e9ab', '카맨샵 노원', '서울 노원구 동일로 120', 37.654210, 127.056657, '["합리적 가격", "예약 가능"]', '카맨샵 노원 지점', '/images/shops/carmanshop_nowon.jpg', 4.4, '02-789-0123'),
('7efb89ec-5c10-47ef-a30c-4c74973e1a33', '오토플러스 송파', '서울 송파구 백제고분로 200', 37.506865, 127.106728, '["정직 정비", "보증 수리"]', '자동차 리뷰 앱 1위', '/images/shops/autoplus_songpa.jpg', 4.8, '02-890-1234'),
('9a34b7d3-cb6e-4e9e-82a5-3964ae4c47b9', '타이어뱅크 강서', '서울 강서구 공항대로 50', 37.561231, 126.849732, '["정품 타이어", "빠른 장착"]', '타이어전문 정비소', '/images/shops/tirebank_gangseo.jpg', 4.3, '02-901-2345'),
('0de63e20-ef67-41d4-9c93-7431420e8b37', '보쉬카서비스 광진', '서울 광진구 능동로 90', 37.549611, 127.074065, '["국제 인증", "고급 진단기기"]', '보쉬 공식 정비소', '/images/shops/boschservice_gwangjin.jpg', 4.6, '02-1234-5678');



