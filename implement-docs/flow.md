## 코드 분석 기능 명세

### 1. 코드 분석 성공

**입력:**
* 사용자가 RegisterProblemModal의 코드 에디터에 분석할 코드를 입력합니다.
* 사용자가 "분석 시작하기" 버튼을 클릭합니다.

**처리:**
1.  **[Frontend]** "분석 시작하기" 버튼 클릭 시, 코드 에디터에 입력된 내용이 있는지 확인합니다. (내용 존재)
2.  **[Frontend]** `apiClient`를 통해 백엔드 API에 코드와 코드의 언어 정보를 담아 분석을 요청합니다.
3.  **[Backend]** API 요청을 받고, 현재 인증된 사용자의 ID(`clerkId`)를 가져옵니다.
4.  **[Backend]** `GeminiClient`의 `getCoreLogics` 메서드를 호출하여 코드 분석을 실행합니다.
5.  **[Backend]** `ProblemService.java` 파일의 저장 방식을 참조하여, `getCoreLogics`로부터 받은 분석 결과를 Redis에 `clerkId`를 키로 하여 저장합니다.
6.  **[Backend]** 저장 후, 분석 결과를 Frontend에 성공 상태로 응답합니다.
7.  **[Frontend]** 성공 응답을 수신하고, 응답 데이터를 URL에 담아 페이지 이동을 준비합니다.

**출력:**
*   사용자는 `/algorithm-logic-flow-analysis` 경로로 이동하며, URL을 통해 전달된 분석 결과를 보게 됩니다. 
*   **Side-effect:** 사용자의 코드 분석 결과가 Redis에 저장됩니다.

### 2. 코드 미입력 상태로 분석 요청

**입력:**
*   사용자가 RegisterProblemModal의 코드 에디터가 비어있는 상태에서 "분석 시작하기" 버튼을 클릭합니다.

**처리:**
1.  **[Frontend]** "분석 시작하기" 버튼 클릭 시, 코드 에디터에 입력된 내용이 있는지 확인합니다. (내용 없음)
2.  **[Frontend]** `apiError` 상태 변수에 코드 미입력과 관련된 오류를 할당합니다.

**출력:**
*   사용자는 RegisterProblemModal 내에서 오류 메시지를 확인합니다. 
*   백엔드 API 요청이 발생하지 않습니다.

### 3. API 요청 또는 서버 처리 실패

**입력:**
*   사용자가 RegisterProblemModal에 코드를 입력하고 "분석 시작하기" 버튼을 클릭합니다.

**처리:**
1.  **[Frontend]** 코드가 존재하는 것을 확인하고 백엔드 API로 분석 요청을 전송합니다.
2.  **[Backend]** 요청을 처리하던 중, 외부 API(GeminiClient) 호출 실패나 데이터베이스(Redis) 저장 실패 등 예측하지 못한 서버 내부 오류가 발생합니다.
3.  **[Backend]** Frontend에 실패 상태(e.g., 5xx 에러)로 응답합니다.
4.  **[Frontend]** 백엔드로부터 실패 응답을 수신합니다.
5.  **[Frontend]** `apiError` 상태 변수에 '잠시 후 다시 시도하세요'와 같은 일반적인 서버 오류 메시지를 할당합니다.

**출력:**
*   사용자는 RegisterProblemModal 내에서 오류 메시지를 확인합니다. 
*   페이지 이동은 발생하지 않습니다.