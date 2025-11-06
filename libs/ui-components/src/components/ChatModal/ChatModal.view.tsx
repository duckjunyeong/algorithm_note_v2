// src/components/ChatModal/ChatModal.view.tsx
interface ChatModalViewProps {
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onGenerateClick: () => void;
  onCloseClick: () => void;
}

export function ChatModalView({
  inputText,
  onInputChange,
  onGenerateClick,
  onCloseClick,
}: ChatModalViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-background-secondary p-spacing-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">추가 텍스트 생성</h2>
          <div className="flex items-center space-x-spacing-2">
            <button className="flex items-center space-x-spacing-1 rounded-sm bg-brand-DEFAULT px-spacing-3 py-spacing-1 text-xs text-text-inverse hover:bg-brand-light">
              <span className="h-3 w-3">
                {/* Free version icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span>무료 버전 적용중</span>
            </button>
            <button className="rounded-md p-spacing-1 text-neutral-400 hover:bg-neutral-50">
              <span className="h-5 w-5">
                {/* Maximize icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 16.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </span>
            </button>
            <button onClick={onCloseClick} className="rounded-md p-spacing-1 text-neutral-400 hover:bg-neutral-50">
              <span className="h-5 w-5">
                {/* Close icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-spacing-4 flex flex-col space-y-spacing-4 lg:flex-row lg:space-x-spacing-4 lg:space-y-0">
          {/* Left panel */}
          <div className="flex-1 rounded-md border border-neutral-100 bg-background-primary p-spacing-4">
            <h3 className="text-sm font-semibold text-text-primary">다음 텍스트</h3>
            <div className="mt-spacing-3 flex items-center space-x-spacing-2 text-xs text-text-secondary">
              <img src="/placeholder-avatar.png" alt="User avatar" className="h-spacing-6 w-spacing-6 rounded-full" />
              <span>안녕하세요, 젠틴! 멋진 프로젝트를 시작하려니 벌써부터 설레네요! 🚀</span>
            </div>
            <p className="mt-spacing-3 text-sm text-text-primary">
              우선, 이번에 텍스트 계획을 세우려는 프로젝트의 현재 상황이나 목표에 대해 간단히 알려주실 수 있으신가요?
            </p>
            <p className="mt-spacing-2 text-sm text-text-primary">
              예를 들어, 어떤 기능을 구현하고 싶으신지, 혹은 기술 기반을 다지고 싶은지, 아니면 리팩토링이나 개선 작업에
              집중하고 싶은지요?
            </p>
            <p className="mt-spacing-2 text-sm text-text-primary">함께 최적의 계획을 세워서 멋진 결과를 만들어봐요! ✨</p>

            <div className="mt-spacing-4">
              <h4 className="text-sm font-semibold text-text-primary"># 작업내용</h4>
              <ul className="mt-spacing-2 list-disc pl-spacing-4 text-sm text-text-primary">
                <li>- UI 컴포넌트 추가</li>
                <li>- 상태 관리 로직 구현</li>
                <li>- API 연동</li>
              </ul>
            </div>
            <p className="mt-spacing-4 text-xs text-semantic-warning">
              추천 답변 생성은 Free 플랜에서 제공되지 않습니다.
            </p>
            <div className="relative mt-spacing-4">
              <textarea
                value={inputText}
                onChange={onInputChange}
                placeholder="메시지를 입력하세요..."
                className="w-full rounded-md border border-neutral-300 bg-background-secondary p-spacing-3 text-sm text-text-primary focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT"
                rows={4}
              ></textarea>
              <button
                onClick={onGenerateClick}
                className="absolute bottom-spacing-3 right-spacing-3 rounded-md bg-brand-DEFAULT p-spacing-2 text-text-inverse hover:bg-brand-light"
              >
                <span className="h-5 w-5">
                  {/* Up arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right panel (chat bubble) */}
          <div className="flex-1">
            <div className="rounded-lg bg-brand-DEFAULT p-spacing-4 text-text-inverse">
              <p className="text-sm">안녕하세요! 텍스트 계획을 세우고 싶습니다.</p>
            </div>
          </div>
        </div>
        <div className="mt-spacing-4 flex justify-end">
          <button
            onClick={onCloseClick}
            className="rounded-md border border-neutral-300 bg-background-secondary px-spacing-4 py-spacing-2 text-sm font-medium text-text-primary hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}