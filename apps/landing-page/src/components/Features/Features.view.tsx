// components/Features/Features.view.tsx

import { ArrowUpRight } from 'lucide-react';

// FeaturesView 컴포넌트가 받을 props 타입 정의 (현재는 비어있음)
interface FeaturesViewProps {
  // 향후 인터랙션이 추가되면 이곳에 props를 정의합니다.
}

export function FeaturesView({}: FeaturesViewProps) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:grid-cols-2">
          
          {/* Left Column: Text Content */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Let banking power your financial operations
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Banking should do more for your business. Now, it can.
            </p>
            <a
              href="/demo"
              className="mt-8 inline-flex items-center gap-x-2 rounded-md border border-gray-300
                         bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm
                         transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-indigo-500 focus:ring-offset-2"
            >
              Explore Demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right Column: Diagram Image */}
          <div className="flex items-center justify-center">
            {/* 이 다이어그램은 CSS로 구현하기 매우 복잡하므로,
              SVG나 PNG 이미지 파일로 처리하는 것이 가장 효율적입니다.
              실제 이미지 경로로 교체해주세요.
            */}
            <img
              src="https://i.imgur.com/gK9JgCg.png" // Placeholder image URL
              alt="A diagram showing interconnected financial services like Banking, Treasury, Cards, and Invoicing."
              className="w-full max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}