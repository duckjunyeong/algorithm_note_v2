import { Header } from '../../components/Header';
export function HomeView() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to AlgoRevise
          </h1>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered algorithm problem management platform that analyzes your solutions,
            visualizes solution flow, and provides personalized test problems.
          </p>
        </div>
      </main>
    </div>
  );
}