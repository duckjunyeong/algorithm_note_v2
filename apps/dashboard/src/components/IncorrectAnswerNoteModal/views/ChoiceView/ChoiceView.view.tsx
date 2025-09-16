import { Check, Bell } from 'lucide-react';

interface ChoiceViewProps {
  onUrlSelection: () => void;
  onManualSelection: () => void;
}

export function ChoiceViewComponent({ onUrlSelection, onManualSelection }: ChoiceViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-12 pb-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Please register the problem first
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 p-6">
        {/* URL Registration Card */}
        <div
          className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
          onClick={onUrlSelection}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-green-500/20">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">Register by URL</h3>
          <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">
            Register problem using Baekjoon URL link
          </p>
          <p className="text-xs text-gray-500">
            Only Baekjoon Online Judge allowed
          </p>
        </div>

        {/* Manual Registration Card */}
        <div
          className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
          onClick={onManualSelection}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-blue-500/20">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">Manual Registration</h3>
          <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">
            Register with simple input
          </p>
        </div>
      </div>
    </div>
  );
}