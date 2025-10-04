-- ReviewCard 테이블에 success_rate 컬럼 추가
ALTER TABLE review_card
ADD COLUMN success_rate DOUBLE DEFAULT 0.0;

-- 기존 데이터에 대한 정답률 초기화 (선택사항)
-- 기존 ReviewCard의 정답률을 계산하여 업데이트하려면 아래 주석을 해제하고 실행
-- UPDATE review_card rc
-- SET success_rate = (
--     SELECT
--         CASE
--             WHEN SUM(rq.success_count + rq.fail_count) = 0 THEN 0.0
--             ELSE (SUM(rq.success_count) * 100.0) / SUM(rq.success_count + rq.fail_count)
--         END
--     FROM review_question rq
--     WHERE rq.review_card_id = rc.review_card_id
-- )
-- WHERE EXISTS (
--     SELECT 1 FROM review_question rq WHERE rq.review_card_id = rc.review_card_id
-- );
