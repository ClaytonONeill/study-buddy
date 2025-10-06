// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import CertificationDetailModal from "../components/CertificationDetailModal";

// Services
import { handleCertificationSearch } from "../services/userActions";

// Types
import type { UserProfile as UserProfileType } from "../types/UserProfile";

// Utils
import { formatUserRole } from "../utilities/utils";

// Interfaces
interface AddCertificationProps {
  userProfile: UserProfileType;
}

interface Certification {
  title: string;
  uid: string;
  levels?: string[];
  subtitle?: string;
  url?: string;
  icon_url?: string;
  last_modified?: string;
  type?: string;
  certification_type?: string;
  exams?: string[];
  roles?: string[];
  study_guide?: string[];
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

const AddCertification = ({ userProfile }: AddCertificationProps) => {
  // State
  const [results, setResults] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);

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
          role: userProfile.user_role,
        });

        const certs: Certification[] = data.certifications ?? [];

        // Filter out retired certifications
        const activeCerts = certs.filter((cert) => {
          const subtitle = cert.subtitle || "";
          return (
            !subtitle.includes('div class="WARNING"') ||
            !subtitle.includes("This certification has been retired.")
          );
        });

        setResults(activeCerts);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [userProfile.user_role]);

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

  // Handle certification details click - just use existing data
  const handleSeeDetails = (cert: Certification) => {
    setSelectedCertification(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertification(null);
  };

  // Handle successful add from modal
  const handleAddSuccess = () => {
    setIsModalOpen(false);
    setSelectedCertification(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  // Convert Certification to CertificationDetails format for modal
  const convertToModalData = (cert: Certification) => {
    return {
      uid: cert.uid,
      title: cert.title,
      subtitle: cert.subtitle || "",
      url: cert.url || "",
      icon_url: cert.icon_url || "",
      last_modified: cert.last_modified || new Date().toISOString(),
      type: cert.type || "cert",
      certification_type: cert.certification_type || "role-based",
      exams: cert.exams || [],
      levels: cert.levels || [],
      roles: cert.roles || [],
      study_guide: cert.study_guide || [],
    };
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
      {/* Success Message */}
      {showSuccess && (
        <div
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out"
          style={{ animation: "fadeInOut 2.5s" }}
        >
          <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold flex items-center gap-2 animate-bounce-in">
            <span role="img" aria-label="success">
              ✅
            </span>
            Certification added!
          </div>
        </div>
      )}

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
      <h2 className="mb-2">
        {`Custom certification recommendations based on your role as a ${formatUserRole(
          userProfile.user_role
        )}`}
      </h2>
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
            className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
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

            <button
              onClick={() => handleSeeDetails(cert)}
              className="bg-transparent hover:bg-blue-600 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 mt-4 hover:border-transparent hover:cursor-pointer rounded"
            >
              See details
            </button>
          </div>
        ))}
      </ul>

      {/* Modal */}
      {selectedCertification && (
        <CertificationDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          certificationData={convertToModalData(selectedCertification)}
          onAddSuccess={handleAddSuccess}
        />
      )}

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px);}
            10% { opacity: 1; transform: translateY(0);}
            90% { opacity: 1; transform: translateY(0);}
            100% { opacity: 0; transform: translateY(-20px);}
          }
          .animate-bounce-in {
            animation: fadeInOut 2.5s;
          }
        `}
      </style>
    </div>
  );
};

export default AddCertification;
