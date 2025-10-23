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
      className =" flex items-center justify-center gap-2 w-full px-4 py-2.5
        bg-[#6E64E4] text-white font-medium rounded-lg text-xs
        transition-colors duration-200
        hover:bg-[#5C53C9]
        disabled:opacity-70 disabled:cursor-not-allowed
      "
    >
      <span>Continue with Google</span>
    </button>
  )
}