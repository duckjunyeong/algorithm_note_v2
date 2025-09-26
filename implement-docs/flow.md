## RegisterProblemModal 기능 유저플로우

---

### 유저플로우 1: 사용자가 URL을 통해 문제를 등록하는 경우

1.  **입력 (Input)**
    *   사용자는 RegisterProblemModal의 'URL' 뷰에서 문제 URL을 입력 필드에 기입합니다.
    *   사용자는 "계속하기" 버튼을 클릭합니다.

2.  **처리 (Processing)**
    *   **[Frontend]** "계속하기" 버튼 클릭 이벤트가 발생하면, 입력된 URL이 `https://www.acmicpc.net/problem/{문제번호}` 형식에 맞는지 검증합니다.
        *   (Edge Case: 형식이 올바르지 않은 경우) 검증에 실패하면, API 요청을 보내지 않고 '출력'의 'URL 형식 오류' 단계로 이동합니다.
    *   **[Frontend]** URL 형식이 올바르다면, 로딩 상태를 활성화하고, JWT 인터셉터가 적용된 Axios 인스턴스를 통해 백엔드 API로 문제 등록 요청을 보냅니다. (Request Body: `{ "url": "입력된 URL" }`)
    *   **[Backend]** API 엔드포인트는 요청 헤더의 JWT를 검증하여 사용자를 인증합니다.
        *   backend에서 JWT을 파싱할 때 com.clerk:backend-api:3.2.0 라이브러리를 이용해서 파싱할 것
        *   (Edge Case: 인증 실패) 유효하지 않은 토큰일 경우, 401 Unauthorized 또는 403 Forbidden 응답을 반환합니다.
    *   **[Backend]** Jsoup 라이브러리를 사용하여 요청받은 URL의 HTML 문서를 가져옵니다.
        *   (Edge Case: 외부 사이트 연결 실패) 해당 URL에 접속할 수 없거나 페이지가 존재하지 않을 경우, 실패 응답을 반환합니다.
    *   **[Backend]** 다음 CSS 셀렉터를 순서대로 시도하여 데이터를 스크래핑합니다:
        *   문제 제목: `#problem_title`
        *   문제 설명: `#problem_description` 시도 후 실패 시 `#description`
        *   문제 입력: `#problem_input` 시도 후 실패 시 `#input`
        *   문제 출력: `#problem_output` 시도 후 실패 시 `#output`
        *   제한 조건: `#problem_limit` 시도 후 실패 시 `#limit`
    *   **[Backend]** 스크래핑 결과에서 '제한 조건'을 제외한 필수 데이터(제목, 설명, 입력, 출력) 중 하나라도 누락되었는지 확인합니다.
        *   (Edge Case: 필수 데이터 스크래핑 실패) 필수 데이터가 하나라도 null일 경우, 스크래핑 실패 응답을 반환합니다.
    *   **[Backend]** 모든 필수 데이터가 존재하면, 스크래핑한 데이터로 DTO를 생성합니다.
    *   **[Backend]** JWT에서 파싱한 사용자 ID를 Key로, 생성된 DTO를 Value로 하여 Redis에 Hash 형태로 저장합니다.
        *   (Edge Case: Redis 저장 실패) Redis 서버에 문제가 발생하여 저장이 실패할 경우, 500 Internal Server Error 응답을 반환합니다.
    *   **[Backend]** 저장이 완료되면, 성공 응답을 프론트엔드로 반환합니다.

3.  **출력 (Output)**
    *   (Success Case) API로부터 성공 응답을 받으면, 로딩 상태를 비활성화하고 다음 단계(예: 코드 에디터 뷰)로 전환합니다.
    *   (Failure Case: URL 형식 오류) 입력 필드의 내용을 지우고, 형식에 맞지 않음을 알리는 에러 메시지를 UI에 표시합니다.
    *   (Failure Case: 백엔드 오류) API로부터 실패 응답(스크래핑 실패, 인증 실패, 서버 오류 등)을 받으면, 로딩 상태를 비활성화하고 작업에 실패했음을 알리는 에러 메시지를 UI에 표시합니다.

---

### 유저플로우 2: 사용자가 수동으로 문제를 등록하는 경우

1.  **입력 (Input)**
    *   사용자는 RegisterProblemModal의 'MANUAL' 뷰에서 문제 제목, 설명, 입력, 출력, 제한 조건 등 각 항목에 해당하는 내용을 입력 필드에 기입합니다.
    *   사용자는 "등록하기" 버튼을 클릭합니다.

2.  **처리 (Processing)**
    *   **[Frontend]** "등록하기" 버튼 클릭 이벤트가 발생하면, 필수 입력 필드(예: 문제 제목, 설명 등)가 모두 채워졌는지 검증합니다.
        *   (Edge Case: 필수값이 누락된 경우) 검증에 실패하면, API 요청을 보내지 않고 '출력'의 '입력값 오류' 단계로 이동합니다.
    *   **[Frontend]** 검증을 통과하면, 로딩 상태를 활성화하고, JWT 인터셉터가 적용된 Axios 인스턴스를 통해 백엔드 API로 문제 등록 요청을 보냅니다. (Request Body: `{ "title": "...", "description": "...", ... }`)
    *   **[Backend]** API 엔드포인트는 요청 헤더의 JWT를 검증하여 사용자를 인증합니다.
        *   (Edge Case: 인증 실패) 유효하지 않은 토큰일 경우, 401 Unauthorized 또는 403 Forbidden 응답을 반환합니다.
    *   **[Backend]** 요청 본문(Request Body)으로 받은 데이터의 유효성을 검증합니다.
    *   **[Backend]** 유효한 데이터로 문제 DTO를 생성합니다.
    *   **[Backend]** JWT에서 파싱한 사용자 ID를 Key로, 생성된 DTO를 Value로 하여 Redis에 Hash 형태로 저장합니다.
        *   (Edge Case: Redis 저장 실패) Redis 서버에 문제가 발생하여 저장이 실패할 경우, 500 Internal Server Error 응답을 반환합니다.
    *   **[Backend]** 저장이 완료되면, 성공 응답을 프론트엔드로 반환합니다.

3.  **출력 (Output)**
    *   (Success Case) API로부터 성공 응답을 받으면, 로딩 상태를 비활성화하고 다음 단계(예: 코드 에디터 뷰)로 전환합니다.
    *   (Failure Case: 입력값 오류) 각 필수 입력 필드 하단에 누락되었음을 알리는 에러 메시지를 UI에 표시합니다.
    *   (Failure Case: 백엔드 오류) API로부터 실패 응답(인증 실패, 서버 오류 등)을 받으면, 로딩 상태를 비활성화하고 작업에 실패했음을 알리는 에러 메시지를 UI에 표시합니다.