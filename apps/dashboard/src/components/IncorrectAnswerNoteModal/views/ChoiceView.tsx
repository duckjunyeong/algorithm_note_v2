import { Link, Bell } from 'lucide-react';

interface ChoiceViewProps {
  onChoiceSelect: (type: 'url' | 'manual') => void;
}

export function ChoiceView({ onChoiceSelect }: ChoiceViewProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Please register the problem first
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div
          className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
          onClick={() => onChoiceSelect('url')}
        >
          <Link className="w-12 h-12 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Register by URL</h3>
          <p className="text-gray-300 text-sm">
            Register problem using Baekjoon URL link
          </p>
          <p className="text-gray-400 text-xs">
            Only Baekjoon Online Judge allowed
          </p>
        </div>

        <div
          className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center gap-4 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
          onClick={() => onChoiceSelect('manual')}
        >
          <Bell className="w-12 h-12 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Manual Input</h3>
          <p className="text-gray-300 text-sm">
            Manually enter problem information
          </p>
        </div>
      </div>
    </div>
  );
}