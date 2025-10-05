import React from "react";
import { Award, Calendar, Clock } from "lucide-react";

interface CompletedCertificationProps {
  certName: string;
  dateCompleted: string;
  expirationDate: string;
}

const CompletedCertification: React.FC<CompletedCertificationProps> = ({
  certName,
  dateCompleted,
  expirationDate,
}) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <Award className="w-6 h-6 text-green-600" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{certName}</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                <span className="font-medium">Completed:</span> {dateCompleted}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                <span className="font-medium">Expires:</span> {expirationDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          ✓ Certified
        </span>
      </div>
    </div>
  );
};

export default CompletedCertification;
