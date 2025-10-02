## 데이터베이스 관점의 데이터플로우

---

### 카테고리 목록 조회 (플로우 1)

*   **Trigger:** 사용자가 `TaskCreationModal`에 진입.
*   **DB Action:** `SELECT`
*   **Description:** 현재 로그인된 `user_id`를 기준으로 `categories` 테이블에서 해당 사용자가 소유한 모든 카테고리 레코드(`category_id`, `name`, `color`)를 조회합니다.

### 신규 카테고리 중복 검사 및 생성 (플로우 2)

*   **Trigger:** 사용자가 새로운 카테고리 이름과 색상을 입력 후 '저장' 버튼 클릭.
*   **DB Action:** `SELECT` (for validation) -> `INSERT` (on success)
*   **Description:**
    *   **Validation:** 먼저 `categories` 테이블에 현재 `user_id`와 사용자가 입력한 `name`이 동일한 레코드가 있는지 `SELECT`하여 확인합니다. (중복 방지)
    *   **Creation:** 중복이 아닐 경우, `categories` 테이블에 새로운 레코드를 `INSERT`합니다. 이 레코드에는 `name`, `color`, 그리고 현재 `user_id`가 포함됩니다.

### Task 생성 시 카테고리 정보 연동 (플로우 1, 2의 최종 결과)

*   **Trigger:** 사용자가 카테고리 선택을 완료하고 최종적으로 Task를 생성.
*   **DB Action:** `INSERT`
*   **Description:** `tasks` 테이블에 새로운 레코드를 `INSERT`합니다. 이 레코드에는 Task의 다른 정보들과 함께, 사용자가 선택(또는 방금 생성)한 `category_id`가 외래 키(Foreign Key)로 포함됩니다.

---

## 최소 스펙 데이터베이스 스키마 (Spring Data JPA & MySQL)

유저플로우에 명시된 사용자, 카테고리, Task 간의 관계를 기반으로 스키마를 구성합니다.

*   `User`는 여러 개의 `Category`를 가질 수 있습니다. (1:N)
*   `Category`는 여러 개의 `Task`에 적용될 수 있습니다. (1:N)
*   `User`는 여러 개의 `Task`를 가질 수 있습니다. (1:N)

