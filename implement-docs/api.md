
## URL로 문제 등록 API

백준 URL을 받아 해당 문제 정보를 스크래핑하고 Redis에 임시 저장하는 API입니다.

**Endpoint:** `POST /api/problems/register/url`

---

### 요청 (Request)

**Headers**

| Key          | Value            | Description        |
| :----------- | :--------------- | :----------------- |
| `Content-Type` | `application/json` |                    |
| `Authorization` | `Bearer <JWT>`   | 사용자 인증을 위한 JWT |

**Body**

| Key   | Type   | Description                                       |
| :---- | :----- | :------------------------------------------------ |
| `url` | `string` | (필수) `https://www.acmicpc.net/problem/{문제번호}` 형식의 백준 문제 URL |

**Example**

```json
{
  "url": "https://www.acmicpc.net/problem/1000"
}
```

---

### 응답 (Response)

#### ✅ 성공: 200 OK

| Key       | Type     | Description    |
| :-------- | :------- | :------------- |
| `message` | `string` | 성공 메시지    |
| `status`  | `string` | `success`      |

**Example**

```json
{
  "message": "문제가 성공적으로 임시 등록되었습니다.",
  "status": "success"
}
```

#### ❌ 실패

*   **400 Bad Request:** URL 형식이 잘못되었거나, 스크래핑에 실패했을 때
*   **401 Unauthorized:** JWT 토큰이 없거나 유효하지 않을 때
*   **500 Internal Server Error:** Redis 저장 실패 등 서버 내부 오류 발생 시

**Error Response Example**

```json
{
  "error": "Bad Request",
  "message": "URL 형식이 올바르지 않습니다.",
  "status": "error"
}
```

---

## 2. 수동으로 문제 등록 API

사용자가 직접 입력한 문제 정보를 받아 Redis에 임시 저장하는 API입니다.

**Endpoint:** `POST /api/problems/register/manual`

---

### 요청 (Request)

**Headers**

| Key          | Value            | Description        |
| :----------- | :--------------- | :----------------- |
| `Content-Type` | `application/json` |                    |
| `Authorization` | `Bearer <JWT>`   | 사용자 인증을 위한 JWT |

**Body**

| Key             | Type     | Description        |
| :-------------- | :------- | :----------------- |
| `title`         | `string` | (필수) 문제 제목   |
| `description`   | `string` | (필수) 문제 설명   |
| `inputCondition` | `string` | (필수) 문제 입력 조건 |
| `outputCondition` | `string` | (필수) 문제 출력 조건 |
| `constraints`   | `string` | (선택) 문제 제한 조건 |

**Example**

```json
{
  "title": "A+B",
  "description": "두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.",
  "inputCondition": "첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)",
  "outputCondition": "첫째 줄에 A+B를 출력한다.",
  "constraints": "시간 제한 1초"
}
```

---

### 응답 (Response)

#### ✅ 성공: 200 OK

| Key       | Type     | Description    |
| :-------- | :------- | :------------- |
| `message` | `string` | 성공 메시지    |
| `status`  | `string` | `success`      |

**Example**

```json
{
  "message": "문제가 성공적으로 임시 등록되었습니다.",
  "status": "success"
}
```

#### ❌ 실패

*   **400 Bad Request:** 필수 입력값이 누락되었을 때
*   **401 Unauthorized:** JWT 토큰이 없거나 유효하지 않을 때
*   **500 Internal Server Error:** Redis 저장 실패 등 서버 내부 오류 발생 시

**Error Response Example**

```json
{
  "error": "Bad Request",
  "message": "필수 입력값 'title'이 누락되었습니다.",
  "status": "error"
}
```