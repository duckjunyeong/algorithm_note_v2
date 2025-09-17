import React, { useState } from 'react';

export function useHero() {
  // 이메일 입력 값을 위한 상태
  const [email, setEmail] = useState('');

  // 이메일 input의 변경 이벤트를 처리하는 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 폼 제출 이벤트를 처리하는 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 페이지 리로드 방지
    
    // 실제 애플리케이션에서는 여기서 API 호출 등을 수행합니다.
    if (email) {
      alert(`Email submitted: ${email}`);
      setEmail(''); // 제출 후 입력 필드 초기화
    } else {
      alert('Please enter your email.');
    }
  };

  // View 컴포넌트에서 사용할 상태와 핸들러들을 반환
  return {
    email,
    handleEmailChange,
    handleSubmit,
  };
}