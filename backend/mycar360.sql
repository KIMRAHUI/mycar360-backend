-- ✅ DB 선택 (이미 있다면 생략 가능)
CREATE DATABASE IF NOT EXISTS mycar360_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mycar360_db;

-- ✅ 기존 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS inspection_history;
DROP TABLE IF EXISTS vehicle_info;

-- ✅ 점검 이력 테이블 재생성
CREATE TABLE inspection_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_number VARCHAR(20) NOT NULL,
  inspection_type VARCHAR(100) NOT NULL,
  shop_name VARCHAR(100),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 차량 정보 테이블 재생성
CREATE TABLE vehicle_info (
  car_number VARCHAR(20) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  parts TEXT,   -- JSON 문자열: 교체 부품 이력
  history TEXT  -- JSON 문자열: 점검 이력 요약
);

-- ✅ 점검 이력 예시 데이터 삽입
INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note) VALUES
('12가3456', '엔진오일 교체', '현대오토큐 강남점', '2024-12-15', '주행거리 8,000km 도달로 교체'),
('12가3456', '타이어 교체', '타이어프로 삼성점', '2025-01-10', '앞바퀴 2개 마모로 인한 교체'),
('12가3456', '배터리 점검', '카센터 강동점', '2025-02-01', '시동 지연 문제로 점검'),

('34나5678', '브레이크 패드 교환', '오토큐 잠실점', '2025-02-22', '소음 발생으로 교환함'),
('34나5678', '냉각수 보충', '현대서비스센터', '2025-03-03', '정기점검 포함 교체'),

('12가2346', '정기 종합검사', '서울 차량 검사소', '2025-04-20', '국가 정기검사 통과'),
('12가2346', '와이퍼 교체', '카마트 대치점', '2025-05-01', '우천 시 시야 불량으로 교체');

-- ✅ 차량 정보 예시 데이터 삽입
INSERT INTO vehicle_info (car_number, type, year, parts, history) VALUES
('12가3456', 'Hyundai Elantra N', '2022',
 '["배터리 교체 (2024.03)", "타이어 교체 (2023.09)"]',
 '["점검 (2024.01)", "오일 교환 (2023.08)"]'),

('34나5678', 'Kia K5', '2020',
 '["브레이크 패드 교체 (2023.10)", "냉각수 보충 (2023.07)"]',
 '["정기점검 (2023.12)", "하체 점검 (2023.11)"]'),

('12가2346', '현대 그랜저 IG', '2021',
 '["배터리 교체 (2024.03)", "타이어 교체 (2023.11)"]',
 '["정기점검 (2024.01)", "엔진오일 교체 (2023.08)"]');

-- ✅ 확인용 쿼리
SHOW TABLES;
DESCRIBE inspection_history;
DESCRIBE vehicle_info;

SELECT * FROM inspection_history;
SELECT * FROM vehicle_info;

-- 차량 12가3456에 대한 점검 이력 삽입
INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('12가3456', '엔진오일 교체', '현대오토큐 강남점', '2024-12-15', '주행거리 8,000km 도달로 교체', 1),
('12가3456', '배터리 점검', '카센터 강동점', '2025-01-10', '겨울철 시동 문제 발생으로 점검', 1);

-- 차량 34나5678 이력 삽입
INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('34나5678', '브레이크 패드 교환', '오토큐 잠실점', '2025-02-22', '소음 발생으로 교환함', 2),
('34나5678', '냉각수 보충', '현대서비스센터', '2025-03-03', '정기점검 포함 교체', 2);

-- 차량 12가2346 이력 삽입
INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('12가2346', '정기 종합검사', '서울 차량 검사소', '2025-04-20', '국가 정기검사 통과', 3),
('12가2346', '와이퍼 교체', '카마트 대치점', '2025-05-01', '우천 시 시야 불량으로 교체', 3);


INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('12가3456', '엔진오일 교체', '현대오토큐 강남점', '2024-12-15', '주행거리 8,000km 도달로 교체', 1),
('12가3456', '배터리 점검', '카센터 강동점', '2025-01-10', '겨울철 시동 지연 문제로 점검', 1),
('12가3456', '타이어 교체', '타이어프로 삼성점', '2024-06-03', '앞바퀴 마모 확인 후 교체', 1),
('12가3456', '브레이크 패드 점검', '오토큐 대치점', '2024-05-11', '감속 시 소음 발생', 1),
('12가3456', '에어컨 필터 교체', '현대오토큐 강남점', '2023-11-22', '냄새 발생으로 교체', 1),
('12가3456', '정기 점검', '서울 차량 검사소', '2023-10-10', '주기적 점검', 1),
('12가3456', '냉각수 보충', '카센터 서초점', '2023-09-18', '온도 경고등 점등 후 방문', 1),
('12가3456', '하체 점검', '오토큐 삼성점', '2023-08-01', '승차감 불량 원인 확인', 1),
('12가3456', '엔진룸 청소', '카마트 강동점', '2023-07-10', '먼지 누적 제거', 1),
('12가3456', '타이어 공기압 점검', '타이어나라 대치점', '2023-06-01', '경고등 점등 후 점검', 1);



INSERT INTO inspection_history (car_number, inspection_type, shop_name, date, note, user_id) VALUES
('12가2346', '엔진오일 교체', '현대오토큐 송파점', '2025-04-15', '주행거리 10,000km 도달', 3),
('12가2346', '브레이크 패드 교체', '오토큐 대치점', '2025-03-10', '브레이크 소음 발생으로 교체', 3),
('12가2346', '타이어 교체', '타이어프로 강남점', '2025-02-20', '마모율 70% 이상으로 교체', 3),
('12가2346', '배터리 점검', '카센터 강동점', '2025-01-15', '겨울철 저전압 문제 점검', 3),
('12가2346', '정기 점검', '서울 차량 검사소', '2024-12-05', '2년 주기 정기 검사', 3),
('12가2346', '에어컨 필터 교체', '현대오토큐 강동점', '2024-11-11', '냄새 발생으로 교체', 3),
('12가2346', '냉각수 보충', '현대서비스센터', '2024-10-20', '온도 경고등 점등 후 보충', 3),
('12가2346', '하체 점검', '오토큐 잠실점', '2024-09-01', '운전 중 진동 문제 점검', 3),
('12가2346', '엔진룸 청소', '카마트 송파점', '2024-08-10', '먼지 축적 제거', 3),
('12가2346', '타이어 공기압 점검', '타이어나라 강남점', '2024-07-05', '공기압 경고등 점등 후 점검', 3);




SELECT * FROM inspection_history;

SELECT * FROM favorites WHERE user_id = 1;

INSERT INTO favorites (user_id, inspection_item_id)
VALUES 
  (1, 3),  -- 타이어 공기압 점검
  (1, 4),  -- 배터리 점검
  (1, 5);  -- 브레이크 패드 점검
