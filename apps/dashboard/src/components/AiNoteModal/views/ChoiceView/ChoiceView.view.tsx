import { Link, Edit } from 'lucide-react';

interface ChoiceViewProps {
  onUrlChoice: () => void;
  onManualChoice: () => void;
}

export function ChoiceViewComponent({ onUrlChoice, onManualChoice }: ChoiceViewProps) {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Problem Registration Method
        </h2>
        <p className="text-gray-600">
          Choose how you would like to register your algorithm problem
        </p>
      </div>

      {/* Choice Cards */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* URL Registration Card */}
        <button
          onClick={onUrlChoice}
          className="flex-1 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500
                   hover:bg-blue-50 transition duration-200 text-left group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition duration-200">
              <Link className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Register by URL
              </h3>
              <p className="text-gray-600 mb-2">
                Register problem using Baekjoon URL link
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Only Baekjoon Online Judge allowed
              </p>
            </div>
          </div>
        </button>

        {/* Manual Registration Card */}
        <button
          onClick={onManualChoice}
          className="flex-1 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500
                   hover:bg-green-50 transition duration-200 text-left group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition duration-200">
              <Edit className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manual Input
              </h3>
              <p className="text-gray-600">
                Manually input problem information
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}