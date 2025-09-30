# 복습 카드 시스템 설계 문서

---

## 데이터플로우 (Database 관점)

### 카드 생성 (Create)
1. 사용자가 카드 생성을 요청하면, **Frontend**는 카드 정보(제목, 카테고리 등)와 질문 목록을 담아 **Backend**로 API 호출  
2. **Backend**는 요청을 받아 현재 사용자 정보와 연결하여 `review_card` 테이블에 새로운 행 **INSERT**  
3. 동시에, 질문 목록을 `review_question` 테이블에 여러 행으로 **INSERT**  
   - 이때, 방금 생성된 `review_card`의 ID를 **외래 키**로 참조  

### 카드 조회 (Read)
1. 사용자가 대시보드에 접근 시, **Frontend**는 Backend로 카드 목록 조회 API 호출  
2. **Backend**는 현재 사용자 ID를 기준으로 해당 사용자가 소유한 모든 `review_card`를 **SELECT**  
3. 조회 결과를 Frontend로 전달  
4. Frontend는 `isActive` 값에 따라:
   - `true` → **'백로그' 컬럼**
   - `false` → **'완료' 컬럼**  
   으로 카드를 렌더링  

---

## 세부 개발 계획 및 스키마

### Frontend 개발 계획

#### 상태 관리 (State Management)
- 사용자의 전체 카드 목록을 담을 전역 상태(`reviewCards`) 관리  
- 예시: Zustand, Recoil, Redux Toolkit  

#### 컴포넌트 및 로직
- **TaskCreationModal**  
  - 사용자의 입력을 상태(State)로 관리  
  - `'등록하기'` 버튼 클릭 시 `POST /api/reviewCard/create` API 호출  
- **DashboardPage**  
  - 페이지 마운트 시 `GET /api/reviewCard` 호출  
  - 받아온 데이터를 전역 상태에 저장  
- **DashboardView**  
  - 전역 상태 `reviewCards`를 구독(subscribe)  
  - `isActive` 값에 따라 '백로그'(true), '완료'(false) 컬럼으로 필터링 후 카드 목록 렌더링  

#### API 연동
- `apiClient.ts` 내에 위 API 명세에 맞는 요청 함수 구현 후 사용  

---

### Backend 개발 계획 (Spring Boot)

#### Controller (`ReviewCardController.java`)
- `@PostMapping("/create")` → 카드 생성 엔드포인트  
- `@GetMapping` → 사용자의 모든 카드 목록 조회 엔드포인트  

#### Service (`ReviewCardService.java`)
- `createReviewCard(RequestDto, userId)`  
  - DTO + 사용자 ID 기반으로 `ReviewCard`, `ReviewQuestion` 엔티티 생성  
  - 연관 관계 설정 후 Repository에 저장  
  - `@Transactional` 적용으로 데이터 일관성 보장  
- `findAllByUserId(userId)`  
  - 사용자 ID 기준으로 `ReviewCard` 조회 후 DTO 리스트 반환  

#### Repository (Spring Data JPA)
- `ReviewCardRepository`  
  - User 객체 기반 ReviewCard 목록 조회 메서드 정의  
  - `List<ReviewCard> findAllByUser(User user);`  
- `ReviewQuestionRepository`  
  - ReviewQuestion 엔티티 관리  

#### DTO (Data Transfer Object)
- `ReviewCardCreateRequestDto`  
  - 카드 생성 시 Frontend에서 전달되는 데이터 (제목, 카테고리, 중요도, 반복주기, 질문목록)  
- `ReviewCardResponseDto`  
  - 카드 조회 시 Frontend로 전달할 데이터  

---

## API 명세

### 1. 신규 복습 카드 생성
- **Endpoint**: `POST /api/reviewCard/create`  
- **Description**: 신규 복습 카드와 포함된 질문 생성  

#### Request Body (JSON)
```json
{
  "title": "JPA N+1 문제",
  "category": "Spring",
  "importance": 5,
  "reviewCycle": 7,
  "questions": [
    { "text": "N+1 문제가 발생하는 근본적인 원인은 무엇인가?" },
    { "text": "Fetch Join을 사용했을 때와 아닐 때의 SQL 차이는?" }
  ]
}

Responses

201 Created: 성공적으로 생성됨

400 Bad Request: 필수 입력값 누락 시 발생

2. 사용자 복습 카드 목록 조회

Endpoint: GET /api/reviewCard

Description: 로그인된 사용자의 모든 복습 카드 목록 조회

Request Body

없음

Responses

200 OK: 카드 목록 배열 반환

[
  {
    "reviewCardId": 1,
    "title": "JPA N+1 문제",
    "category": "Spring",
    "importance": 5,
    "reviewCycle": 7,
    "isActive": true,
    "reviewCount": 0
  },
  {
    "reviewCardId": 2,
    "title": "Base64 인코딩",
    "category": "CS",
    "importance": 3,
    "reviewCycle": 14,
    "isActive": false,
    "reviewCount": 3
  }
]

401 Unauthorized: 인증되지 않은 사용자 요청 시 발생

데이터베이스 스키마 (MySQL)
1. users — 사용자 정보
    Column	Type	Constraints	Description
    user_id	BIGINT	PK, AUTO_INCREMENT	사용자 고유 ID
    email	VARCHAR(255)	UNIQUE, NOT NULL	사용자 이메일 (로그인 식별자)
    created_at	DATETIME	NOT NULL	생성 일시


2. review_card — 복습 카드
    Column	Type	Constraints	Description
    review_card_id	BIGINT	PK, AUTO_INCREMENT	카드 고유 ID
    user_id	BIGINT	FK (users.user_id)	카드 소유자 (@ManyToOne)
    title	VARCHAR(255)	NOT NULL	카드 제목
    category	VARCHAR(100)		카테고리
    importance	INT	NOT NULL	중요도
    review_cycle	INT	NOT NULL	반복 주기 (일 단위)
    is_active	BOOLEAN	NOT NULL, DEFAULT true	활성화 상태 (백로그/완료 구분)
    review_count	INT	NOT NULL, DEFAULT 0	반복 학습 횟수
    created_at	DATETIME	NOT NULL	생성 일시
    updated_at	DATETIME	NOT NULL	마지막 수정 일시


3. review_question — 카드 질문
    Column	Type	Constraints	Description
    review_question_id	BIGINT	PK, AUTO_INCREMENT	질문 고유 ID
    review_card_id	BIGINT	FK (review_card.review_card_id)	소속된 카드 (@ManyToOne)
    question_text	TEXT	NOT NULL	질문 내용
    created_at	DATETIME	NOT NULL	생성 일시