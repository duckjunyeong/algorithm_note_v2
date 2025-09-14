import React from 'react'

interface SignInWithEmailButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  onClick: () => void;
  children?: React.ReactNode;
}

export const SignInWithEmailButton = ({
  onClick,
  disabled,
  children,
  ...props
}: SignInWithEmailButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`
        flex items-center justify-center gap-2 w-full px-4 py-2.5
        bg-[#1E2025] text-[#E3E4E6] font-medium rounded-lg text-xs
        transition-colors duration-200
        hover:bg-[#2a2d33]
        disabled:opacity-75 disabled:cursor-not-allowed
      `}
      {...props}
    >
      <span>{children || 'Continue with Email'}</span>
    </button>
  )
}