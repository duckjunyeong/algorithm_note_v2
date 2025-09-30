평가 화면 진입: 사용자가 특정 Question에 대한 평가 화면으로 진입합니다.

SELECT: 현재 question_id를 조건으로, Answer 테이블에서 이전에 작성된 답변 목록 전체를 조회합니다.

평가 완료: 사용자가 평가를 완료합니다.

INSERT: 사용자의 답변 내용(content)과 평가 결과(evaluation_result)를 현재 question_id와 함께 Answer 테이블에 새로운 레코드로 저장합니다