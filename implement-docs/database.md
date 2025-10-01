## 데이터베이스 관점 데이터플로우

### 테스트 시작 (Read)

* 사용자가 테스트를 시작하면, 시스템은 기존 `ReviewCard` 객체와 여기에 연관된 모든 `Question` 객체 목록을 데이터베이스에서 조회합니다.

### 질문 평가 (Update)

* 사용자가 '성공' 또는 '실패'를 클릭할 때마다, 시스템은 `ReviewCard` 객체에 새로 추가된 `success_count` 또는 `fail_count` 필드의 값을 1씩 증가시키는 `UPDATE` 쿼리를 `review_card` 테이블에 실행합니다.

### 테스트 결과 저장 (Update or Delete)

* 사용자가 '저장하기'를 클릭하면 하나의 트랜잭션(Transaction)이 시작됩니다.

#### Case A: 카드 유지 시 (UPDATE)

1. `question` 테이블에서 삭제 대상으로 선택된 레코드들을 `DELETE` 합니다.
2. `review_card` 테이블의 해당 레코드를 `UPDATE` 합니다. 이때 사용자가 수정한 `category`, `importance` 등의 기존 필드와 함께, `is_active` 필드를 `false`로 변경합니다.

#### Case B: 모든 질문 삭제로 카드 삭제 시 (DELETE)

1. `review_card` 테이블에서 해당 레코드를 `DELETE` 합니다. (`ON DELETE CASCADE` 설정에 의해 연관된 `question` 레코드들도 함께 삭제됩니다.)

### 데이터베이스 스키마 (기존 객체에 필드 추가)

* `Question` 객체는 변경이 없으며, 기존 `ReviewCard` 객체에 `successCount`와 `failCount` 필드를 추가해야 합니다.
`
`