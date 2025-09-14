interface SignInWithGoogleButtonViewProps {
  isLoading: boolean
  onClick: () => void
}

export const SignInWithGoogleButtonView = ({
  isLoading,
  onClick,
}: SignInWithGoogleButtonViewProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      className={`
        flex items-center justify-center gap-2 w-full px-4 py-2.5
        bg-[#6E64E4] text-white font-semibold rounded-lg
        transition-colors duration-200
        hover:bg-[#5C53C9]
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5" // 변경: 아이콘 크기 지정
      >
        <path
          fill="currentColor"
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 2.04-4.82 2.04-5.84 0-9.42-4.82-9.42-10.57 0-5.75 3.58-10.58 9.42-10.58 3.33 0 5.38 1.36 6.62 2.55l2.67-2.67C19.74 3.05 16.56 2 12.48 2c-8.4 0-14.48 6.5-14.48 14.48s6.08 14.48 14.48 14.48c8.82 0 13.2-6.23 13.2-13.03 0-.9-.08-1.4-.2-1.92z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  )
}