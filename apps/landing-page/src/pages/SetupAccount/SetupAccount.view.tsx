export function SetupAccountView() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">계정을 설정하고 있습니다</h2>
        <p className="text-gray-600">잠시만 기다려주세요...</p>
        <div className="mt-4 text-sm text-gray-500">
          역할을 확인하고 대시보드로 이동합니다
        </div>
      </div>
    </div>
  );
}