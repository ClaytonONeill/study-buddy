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
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Map levels to numeric values for sorting
const levelRank: Record<string, number> = {
  beginner: 1,
  easy: 1,
  intermediate: 2,
  advanced: 3,
};

const AddCertification: React.FC = () => {
  // State
  const [results, setResults] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  // Hooks
  const navigate = useNavigate();

  // Constants
  const PRIMARY_LEVEL_INDEX: number = 0;

  /*
   * This is the running list of valid subjects to pass into the API.
   * This would map to our user "industry" field
   *
   * Security & Compliance:
   * "security"
   * "compliance"
   * "threat-protection"
   * "information-protection-governance"
   * "identity-access"
   * "cloud-security"
   *
   * Cloud & Infrastructure:
   * "cloud-computing"
   * "virtual-machine"
   * "networking"
   * "migration"
   * "devops"
   * "solution-design"
   * "architecture"
   * "serverless-computing"
   *
   * Data & Databases:
   * "data-engineering"
   * "data-management"
   * "data-modeling"
   * "databases"
   *
   * AI & Advanced Technologies:
   * "artificial-intelligence"
   * "natural-language-processing"
   * "blockchain"
   * "machine-learning"
   *
   * Communication & Collaboration:
   * "communication"
   *
   * Development
   * "app-development"
   * "accessibility"
   */

  // Effects
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);

        const data = await handleCertificationSearch({
          type: "certifications",
          // TODO: Update this to pull from current users profile
          role: "developer",
          // subject: '' TODO: we need to align the accepted subjects with our apps (industry) pathways.
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

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handleFilterChange = (level: string) => {
    setFilterLevel(level);
  };

  // Apply filter
  const filteredResults = results.filter((cert) => {
    if (filterLevel === "all") return true;
    const level = cert.levels?.[PRIMARY_LEVEL_INDEX]?.toLowerCase() || "";
    return level === filterLevel.toLowerCase();
  });

  // Apply sorting
  const sortedResults = [...filteredResults].sort((a, b) => {
    const aLevel = a.levels?.[PRIMARY_LEVEL_INDEX]?.toLowerCase() || "";
    const bLevel = b.levels?.[PRIMARY_LEVEL_INDEX]?.toLowerCase() || "";

    const aRank = levelRank[aLevel] ?? 99;
    const bRank = levelRank[bLevel] ?? 99;

    return sortOrder === "asc" ? aRank - bRank : bRank - aRank;
  });

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-6 bg-white">
      {/* Top Controls */}
      <div className="w-full max-w-3xl mb-4 flex justify-between items-center gap-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Available Certifications</h1>
      {/* Divider */}
      <div className="w-full max-w-3xl mb-6 border-t border-gray-300 opacity-60"></div>
      {/* Sort & Filter Controls */}
      <div className="w-full max-w-3xl mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value as "asc" | "desc")}
          className="w-full sm:w-auto px-3 py-2 pr-8 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Sort: Beginner → Advanced</option>
          <option value="desc">Sort: Advanced → Beginner</option>
        </select>

        {/* Filter Dropdown */}
        <select
          value={filterLevel}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 pr-8 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Filter: All Levels</option>
          <option value="beginner">Filter: Beginner</option>
          <option value="intermediate">Filter: Intermediate</option>
          <option value="advanced">Filter: Advanced</option>
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading certifications...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="w-full max-w-3xl space-y-4">
        {sortedResults.map((cert) => (
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
