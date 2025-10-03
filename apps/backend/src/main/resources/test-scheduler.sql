-- ============================================
-- ReviewCard 재활성화 스케줄러 테스트용 더미 데이터
-- ============================================

-- 사전 조건: user_id=1이 존재해야 함
-- category도 user_id=1로 하나 생성 (없을 경우)

-- 1. 테스트 카테고리 삽입 (이미 있으면 무시)
INSERT IGNORE INTO categories (user_id, name, color, created_at, updated_at)
VALUES (1, '테스트카테고리', '#FF5733', NOW(), NOW());

-- 2. category_id 변수에 저장
SET @category_id = (SELECT category_id FROM categories WHERE user_id = 1 LIMIT 1);

-- 3. ReviewCard 더미데이터 삽입
INSERT INTO review_card (
    user_id,
    title,
    category_id,
    importance,
    review_cycle,
    is_active,
    review_count,
    created_at,
    updated_at
) VALUES (
    1,                                          -- user_id
    '스케줄러 테스트 복습카드',                 -- title
    1,                               -- category_id
    5,                                          -- importance
    1,                                          -- review_cycle (1일)
    false,                                      -- is_active (비활성 상태)
    3,                                          -- review_count
    NOW(),                                      -- created_at
    DATE_SUB(NOW(), INTERVAL 1 DAY)             -- updated_at (1일 전)
);

-- 방금 삽입한 review_card_id 저장
SET @test_card_id = LAST_INSERT_ID();

-- 4. ReviewQuestion 더미데이터 삽입 (수정: review_question -> review_questions)
INSERT INTO review_question (review_card_id, question_text, success_count, fail_count, created_at)
VALUES
    (7, '스케줄러가 10초 후에 이 카드를 재활성화할까요?', 2, 1, NOW()),
    (7, 'updatedAt이 1일 전이고 reviewCycle이 1일이면 재활성화 조건을 만족할까요?', 1, 0, NOW());

-- 5. 결과 확인용 SELECT (수정: review_card -> review_cards)
SELECT
    rc.review_card_id,
    rc.title,
    rc.is_active AS '현재_활성상태',
    rc.review_cycle AS '복습주기_일',
    rc.updated_at AS '마지막_업데이트',
    NOW() AS '현재시각',
    TIMESTAMPDIFF(SECOND, rc.updated_at, NOW()) AS '경과시간_초',
    TIMESTAMPDIFF(DAY, rc.updated_at, NOW()) AS '경과시간_일',
    DATE_ADD(rc.updated_at, INTERVAL rc.review_cycle DAY) AS '재활성화_예정시각',
    CASE
        WHEN DATE_ADD(rc.updated_at, INTERVAL rc.review_cycle DAY) < NOW()
        THEN 'YES ✓'
        ELSE 'NO ✗'
    END AS '재활성화_조건_충족'
FROM review_cards rc
WHERE rc.review_card_id = @test_card_id;