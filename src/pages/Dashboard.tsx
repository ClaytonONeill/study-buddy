// Modules
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { getUserCertifications } from "../services/userActions";

// Components
import CompletedCertification from "../components/CompletedCertification";

// Interfaces
interface UserCertification {
  uid: string;
  ce_hours_required: number;
  cert_level: string;
  user_id: number;
  expires_on: string;
  ce_hours_completed: number;
  description: string;
  required_study_hours: number;
  user_cert_id: number;
  title: string;
  earned_on: string;
}

interface CertificationResponse {
  user_certifications: UserCertification[];
}

// Component types
type Cert = {
  id: string;
  name: string;
  type: string;
  due: string;
  progress: number;
};

const Dashboard = () => {
  // State
  const [sortBy, setSortBy] = useState<
    "due-desc" | "due-asc" | "progress" | "name"
  >("due-desc");
  const [userCertifications, setUserCertifications] = useState<
    UserCertification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUserCertifications();

        // Parse the response - it comes as { body: "stringified JSON" }
        let parsedResponse: CertificationResponse;
        if (response?.body && typeof response.body === "string") {
          parsedResponse = JSON.parse(response.body);
        } else if (typeof response === "string") {
          parsedResponse = JSON.parse(response);
        } else {
          parsedResponse = response;
        }

        // Extract the user_certifications array
        if (
          parsedResponse?.user_certifications &&
          Array.isArray(parsedResponse.user_certifications)
        ) {
          setUserCertifications(parsedResponse.user_certifications);
        } else {
          console.warn("No user_certifications found in response");
          setUserCertifications([]);
        }
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch certifications"
        );
        setUserCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  useEffect(() => {
    console.log("user certs are: ", userCertifications);
  }, [userCertifications]);

  // Convert API data to component format
  const convertedCerts = useMemo(() => {
    return userCertifications.map(
      (cert): Cert => ({
        id: cert.user_cert_id.toString(),
        name: cert.title,
        type: "Certification", // TODO: Default type, might want to derive this from cert_level or other data
        due: cert.expires_on,
        progress: cert.ce_hours_completed / cert.ce_hours_required,
      })
    );
  }, [userCertifications]);

  console.log(convertedCerts);

  // Methods
  const sortedCerts = useMemo(() => {
    const rows = [...convertedCerts];
    rows.sort((a, b) => {
      switch (sortBy) {
        case "due-asc":
          return new Date(a.due).getTime() - new Date(b.due).getTime();
        case "due-desc":
          return new Date(b.due).getTime() - new Date(a.due).getTime();
        case "progress":
          return b.progress - a.progress;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return rows;
  }, [convertedCerts, sortBy]);

  const handleNavigate = (location: String) => {
    navigate(`/${location}`);
  };

  // Calculate KPIs from actual data
  const completedCount = userCertifications.filter(
    (cert) => cert.ce_hours_completed >= cert.ce_hours_required
  ).length;
  const inProgressCount = userCertifications.filter(
    (cert) => cert.ce_hours_completed < cert.ce_hours_required
  ).length;
  const totalHoursStudied = userCertifications.reduce(
    (total, cert) => total + cert.ce_hours_completed,
    0
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-green-600">
              {completedCount}
            </p>
            <p className="text-gray-500">Completed Certifications</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-yellow-600">
              {inProgressCount}
            </p>
            <p className="text-gray-500">Certifications in progress</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-purple-600">
              {totalHoursStudied}
            </p>
            <p className="text-gray-500">Total Hours Studied</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="max-w-5xl mx-auto bg-white shadow rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-300">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition hover:cursor-pointer"
            onClick={() => handleNavigate("addCertification")}
          >
            Add Certification +
          </button>
          <div className="flex items-center gap-2 ">
            <span className="text-gray-600">Sort:</span>
            <select
              className="border rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort certifications"
            >
              <option value="due-desc">Due Date - Desc</option>
              <option value="due-asc">Due Date - Asc</option>
              <option value="progress">Progress</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Active Certs */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading certifications...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {!loading && !error && sortedCerts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No certifications found</p>
            </div>
          )}

          {!loading && !error && sortedCerts.length > 0 && (
            <div className="space-y-3">
              {sortedCerts
                .filter(({ progress }) => progress < 100)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3"
                  >
                    {/* Left: name / type / due */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <strong className="min-w-[200px]">{c.name}</strong>
                      <span className="text-gray-500">{c.type}</span>
                      <span className="text-gray-700">
                        Expires {new Date(c.due).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Right: progress */}
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 hidden sm:inline">
                        CE Hours progress
                      </span>
                      <div
                        className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(c.progress * 100)}
                      >
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${Math.min(c.progress * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(c.progress * 100)}%
                      </span>
                      <button
                        onClick={() => handleNavigate("certs")} // TODO: Wire this up to pass in cert ID as well.
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
                        aria-label={`Open ${c.name}`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cert History */}
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="font-semibold mb-3">Completed Certifications</h3>
            <div className="space-y-2">
              {userCertifications
                .filter(
                  ({ ce_hours_completed, ce_hours_required }) =>
                    ce_hours_completed === ce_hours_required
                )
                .map(({ uid, title, earned_on, expires_on }) => (
                  <div
                    key={uid}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <CompletedCertification
                      certName={title}
                      dateCompleted={earned_on}
                      expirationDate={expires_on}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Tools  */}
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="font-semibold mb-3">Tools</h3>
            <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-4">
              <div className="w-20 h-28 rounded-xl border border-gray-300 grid place-items-center">
                <span className="text-3xl">F</span>
              </div>
              <div>
                <p className="font-semibold">Flash Card Generator</p>
                <p className="text-gray-500 text-sm">
                  Create study cards from notes (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* /Bottom Panels */}
      </div>
    </div>
  );
};

export default Dashboard;
