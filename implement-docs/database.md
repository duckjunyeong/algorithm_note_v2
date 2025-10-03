## 데이터베이스 관점의 데이터플로우 (Database Data Flow)

### 유저 플로우 1: 비활성화된 복습 카드 결과 조회

1.  **[Read]** 클라이언트 요청에 포함된 `review_card_id`를 조건으로 `review_questions` 테이블에서 모든 질문 데이터를 조회합니다.
    *   **SQL 예시:** `SELECT * FROM review_questions WHERE review_card_id = [requested_review_card_id];`
2.  **[Read]** 조회된 각 `review_question_id`를 조건으로 `answers` 테이블에서 모든 답변 데이터를 `created_at` 기준으로 내림차순 정렬하여 조회합니다.
    *   **SQL 예시:** `SELECT * FROM answers WHERE review_question_id = [retrieved_review_question_id] ORDER BY created_at DESC;`
3.  **[Return]** 조회 및 정렬된 데이터를 종합하여 클라이언트에 반환합니다.

### 유저 플로우 2: 복습 카드 자동 재활성화

1.  **[Read]** 스케줄러가 `review_cards` 테이블에서 `is_active`가 `false`인 모든 카드 데이터를 조회합니다.
    *   **SQL 예시:** `SELECT id, updated_at, review_cycle FROM review_cards WHERE is_active = FALSE;`
2.  **[Logic]** 애플리케이션 로직에서 현재 시각과 각 카드의 `updated_at` 값을 비교하여 경과 시간이 `review_cycle`을 초과했는지 판별합니다.
    *   **(예시 로직)** `(현재 시각 - updated_at) >= review_cycle`
3.  **[Update]** 위 조건을 만족하는 모든 `review_card_id`에 대해, `review_cards` 테이블의 `is_active`를 `true`로 변경하고 `updated_at`을 현재 시각으로 갱신합니다.
    *   **SQL 예시:** `UPDATE review_cards SET is_active = TRUE, updated_at = NOW() WHERE id IN ([list_of_re_activate_card_ids]);`