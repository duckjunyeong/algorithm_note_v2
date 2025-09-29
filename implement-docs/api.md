## API 및 데이터 모델 명세 (수정)

### 1. API 명세 정의

#### 1.1 코드 분석 요청

*   **Endpoint:** `POST /api/problems/code/analyze`
*   **Description:** 사용자가 제출한 코드를 분석하고, 논리적 흐름을 추출하여 반환합니다.
*   **Request Body:**

    ```json
    {
      "language": "java",
      "code": "public class Solution { ... }"
    }
    ```

*   **Success Response (200 OK):**

    ```json
    {
      "logical_units": [
        {
          "unit_name": "1. 입력 처리",
          "description": "...",
          "specific_steps": ["..."],
          "code": "..."
        }
      ]
    }
    ```

*   **Error Response (400 Bad Request, 500 Internal Server Error):**

    ```json
    {
      "errorCode": "INVALID_INPUT",
      "message": "코드를 입력해주세요."
    }
    ```

### 2. 데이터 모델(DTO) 정의

#### 2.1 Backend DTOs

*   **`CodeAnalysisRequestDto.java` (수정됨)**

    ```java
    public class CodeAnalysisRequestDto {
        private String language;
        private String code;
        // Getters and Setters
    }
    ```

*   **`CodeAnalysisResponseDto.java` (변경 없음)**

    ```java
    public class CodeAnalysisResponseDto {
        private List<LogicalUnitDto> logicalUnits;
        // Getters and Setters
    }
    ```

*   **`LogicalUnitDto.java` (변경 없음)**

    ```java
    public class LogicalUnitDto {
        private String unitName;
        private String description;
        private List<String> specificSteps;
        private String code;
        // Getters and Setters
    }
    ```
