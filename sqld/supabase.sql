-- 1. 기존 테이블 모두 삭제 (외래키 의존성 고려해 순서대로 CASCADE 사용)
DROP TABLE IF EXISTS inspection_history CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS vehicle_info CASCADE;

-- 2. 차량 정보 테이블 생성
CREATE TABLE vehicle_info (
  car_number VARCHAR(20) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  parts JSONB,
  history JSONB
);

-- 3. 사용자 정보 테이블 생성 (자동 증가 bigint PK, 차량번호 1:1 매칭, vehicle_info 참조)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  car_number VARCHAR(20) UNIQUE NOT NULL REFERENCES vehicle_info(car_number) ON DELETE CASCADE,
  nickname VARCHAR(50) NOT NULL,
  telco VARCHAR(10),
  phone_number VARCHAR(20),
  address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 점검 항목 테이블 생성
CREATE TABLE inspection_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  recommended_cycle TEXT,
  parts TEXT,
  cost_range TEXT,
  warning_light TEXT,
  detail TEXT
);

-- 5. 찜(favorites) 테이블 생성 (user_id → users.id, inspection_item_id → inspection_items.id 외래키)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  inspection_item_id INT NOT NULL REFERENCES inspection_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, inspection_item_id) -- 중복 찜 방지
);

-- 6. 점검 이력 테이블 생성 (user_id nullable, 삭제 시 SET NULL)
CREATE TABLE inspection_history (
  id SERIAL PRIMARY KEY,
  car_number VARCHAR(20) NOT NULL REFERENCES vehicle_info(car_number) ON DELETE CASCADE,
  inspection_type TEXT NOT NULL,
  shop_name VARCHAR(100),
  date DATE NOT NULL,
  note TEXT,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. 차량 정보 데이터 삽입
INSERT INTO vehicle_info (car_number, type, year, parts, history) VALUES
('12가3456', 'Hyundai Elantra N', '2022',
 '["배터리 교체 (2024.03)", "타이어 교체 (2023.09)"]'::jsonb,
 '["점검 (2024.01)", "오일 교환 (2023.08)"]'::jsonb),
('34나5678', 'Kia K5', '2020',
 '["브레이크 패드 교체 (2023.10)", "냉각수 보충 (2023.07)"]'::jsonb,
 '["정기점검 (2023.12)", "하체 점검 (2023.11)"]'::jsonb),
('12가2346', '현대 그랜저 IG', '2021',
 '["배터리 교체 (2024.03)", "타이어 교체 (2023.11)"]'::jsonb,
 '["정기점검 (2024.01)", "엔진오일 교체 (2023.08)"]'::jsonb);

-- 8. 점검 항목 데이터 삽입 (20개)
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
INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('12가3456', '엔진오일 교체', '현대오토큐 강남점', '2024-12-15', '주행거리 8,000km 도달로 교체', 1),
('12가3456', '배터리 점검', '카센터 강동점', '2025-01-10', '시동 지연 문제로 점검', 1),
('12가3456', '타이어 교체', '타이어프로 삼성점', '2024-06-03', '앞바퀴 마모 확인 후 교체', 1);

-- 11. 찜 데이터 삽입
INSERT INTO favorites (user_id, inspection_item_id) VALUES
(1, 3),
(1, 4),
(1, 5);


SELECT id FROM users;
SELECT id FROM inspection_items;
SELECT car_number, jsonb_typeof(parts), jsonb_typeof(history) FROM vehicle_info;

DELETE FROM favorites
WHERE created_at < NOW() - INTERVAL '30 days';


select id, nickname, car_number, address
from users
where id = '1';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';

