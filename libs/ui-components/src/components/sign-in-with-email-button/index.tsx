import React from 'react'

interface SignInWithEmailButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  onClick: () => void
}

export const SignInWithEmailButton = ({
  onClick,
  disabled,
  ...props
}: SignInWithEmailButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`
        flex items-center justify-center gap-2 w-full px-4 py-2.5
        bg-[#1E2025] text-[#E3E4E6] font-semibold rounded-lg
        transition-colors duration-200
        hover:bg-[#2a2d33]
        disabled:opacity-75 disabled:cursor-not-allowed
      `}
      {...props}
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
      >
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        />
      </svg>
      <span>Continue with Email</span>
    </button>
  )
}