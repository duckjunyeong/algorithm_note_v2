export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to AlgoRevise Dashboard
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Dashboard Overview</h2>
            <p className="text-sm text-gray-600">
              This is your dashboard page. Originally this was the DashboardPage from the old dashboard app.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Incorrect Answer Note</h3>
            <p className="text-gray-600 mb-4">Generate AI-powered notes from your algorithm solutions</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              Generate Incorrect Answer Note
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">View Analytics</h3>
            <p className="text-gray-600 mb-4">Check your learning progress and statistics</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              View Analytics
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Practice Problems</h3>
            <p className="text-gray-600 mb-4">Solve AI-generated practice problems</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}