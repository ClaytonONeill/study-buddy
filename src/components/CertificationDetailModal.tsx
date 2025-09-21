// Modules
import React from "react";

// Utilities
// Utils
import { formatLevel, getLevelStyles } from "../utilities/utils";

interface CertificationData {
  uid: string;
  title: string;
  subtitle: string;
  url: string;
  icon_url: string;
  last_modified: string;
  type: string;
  certification_type: string;
  exams: string[];
  levels: string[];
  roles: string[];
  study_guide: string[];
}

interface AddCertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificationData: CertificationData;
}

const AddCertDetailModal: React.FC<AddCertDetailModalProps> = ({
  isOpen,
  onClose,
  certificationData,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseHtmlContent = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-3 border-solid">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <img
              src={certificationData.icon_url}
              alt="Certification badge"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {certificationData.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="capitalize">
                  Type: {certificationData.certification_type}
                </span>
                <span className="capitalize">
                  Level: {certificationData.levels.join(", ")}
                </span>
                <span>
                  Updated: {formatDate(certificationData.last_modified)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          <div className="mb-6">
            {certificationData.subtitle &&
            typeof certificationData.subtitle === "string" ? (
              <div
                className="text-gray-700 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>h3]:font-semibold [&>h3]:text-lg [&>h3]:mb-2 [&>h4]:font-semibold [&>h4]:mb-2"
                dangerouslySetInnerHTML={parseHtmlContent(
                  certificationData.subtitle
                )}
              />
            ) : (
              <p className="text-gray-500 italic">No description available.</p>
            )}
          </div>

          {/* Roles */}
          {certificationData.roles &&
            Array.isArray(certificationData.roles) &&
            certificationData.roles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Target Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {certificationData.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                    >
                      {typeof role === "string"
                        ? role.replace("-", " ")
                        : JSON.stringify(role)}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Level */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Difficulty Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {certificationData.levels.map((level, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm font-medium border rounded-full ${getLevelStyles(
                    level
                  )}`}
                >
                  {formatLevel(level)}
                </span>
              ))}
            </div>
          </div>

          {/* Exams */}
          {certificationData.exams &&
            Array.isArray(certificationData.exams) &&
            certificationData.exams.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Required Exams
                </h3>
                <div className="space-y-2">
                  {certificationData.exams.map((exam, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      {typeof exam === "string" ? exam : JSON.stringify(exam)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors hover:cursor-pointer">
            Add Certification +
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Certification ID: {certificationData.uid}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer"
              >
                Close
              </button>
              <a
                href={certificationData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View on Microsoft Learn →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCertDetailModal;
