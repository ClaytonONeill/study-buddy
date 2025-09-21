// Modules
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Services
import { handleCertificationSearch } from "../services/httpActions";

interface Certification {
  title: string;
  uid: string;
  summary?: string;
}

const AddCertification: React.FC = () => {
  // State
  const [results, setResults] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const navigate = useNavigate();

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
          <li
            key={cert.uid}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <h2 className="font-semibold text-lg">{cert.title}</h2>
            {cert.summary && (
              <p className="text-sm text-gray-600 mt-1">{cert.summary}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCertification;
