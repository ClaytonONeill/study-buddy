// Modules
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Services
import { handleCertificationSearch } from "../services/httpActions";

// Interfaces
interface Certification {
  title: string;
  uid: string;
  levels?: string[];
}

// Helper methods
const formatLevel = (level: string): string => {
  if (!level) return "";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

const getLevelStyles = (level: string): string => {
  switch (level.toLowerCase()) {
    case "beginner":
    case "easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "advanced":
    case "hard":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const AddCertification: React.FC = () => {
  // State
  const [results, setResults] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const navigate = useNavigate();

  // Constants
  const PRIMARY_LEVEL_INDEX: number = 0;

  // Effects
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);

        const data = await handleCertificationSearch({
          type: "certifications",
          role: "developer",
        });

        const certs: Certification[] = data.certifications ?? [];
        setResults(certs);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  // Methods
  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-6 bg-white">
      <div className="w-full max-w-3xl mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Available Certifications</h1>

      <div className="w-full max-w-3xl mb-6 border-t border-gray-300 opacity-60"></div>

      {loading && <p className="text-gray-500">Loading certifications...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="w-full max-w-3xl space-y-4">
        {results.map((cert) => (
          <div
            key={cert.uid}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <li>
              <h2 className="font-semibold text-lg">{cert.title}</h2>

              {cert.levels && cert.levels[PRIMARY_LEVEL_INDEX] && (
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm font-medium border rounded-full ${getLevelStyles(
                    cert.levels[PRIMARY_LEVEL_INDEX]
                  )}`}
                >
                  {formatLevel(cert.levels[PRIMARY_LEVEL_INDEX])}
                </span>
              )}
            </li>

            <button className="bg-transparent hover:bg-blue-600 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 mt-4 hover:border-transparent hover:cursor-pointer rounded">
              See details
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AddCertification;
