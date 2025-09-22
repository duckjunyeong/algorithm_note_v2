import { useState } from "react";
import { SidebarNav } from "../../components/SidebarNav";
import { Header } from "../../components/Header";

export default function DashboardPage() {
 const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-background-tertiary">
      <SidebarNav isOpen={isSidebarOpen} />

      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        `}
      >
        <Header onToggleSidebar={toggleSidebar}/>
          
        <main className="p-6 pt-24">
          <div className="bg-background-secondary p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-text-primary">Main Content Area</h1>
            <p className="mt-2 text-text-secondary">
              이제 상단 헤더바와 왼쪽 사이드바가 함께 작동합니다.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}