import { useMemo, useState } from "react";

type Cert = { id: string; name: string; type: string; due: string; progress: number };
type CertHistory = { id: string; name: string; type: string; completed: string; expires: string };

const activeCerts: Cert[] = [
  { id: "c1", name: "CompTIA Security+", type: "Exam", due: "2025-11-15", progress: 0.8 },
  { id: "c2", name: "AWS Cloud Practitioner", type: "Exam", due: "2025-12-01", progress: 0.55 },
];

const certHistory: CertHistory[] = [
  { id: "h1", name: "Linux Essentials", type: "Cred", completed: "2025-08-14", expires: "2028-08-14" },
  { id: "h2", name: "Network+",         type: "Cred",   completed: "2025-09-01", expires: "2028-09-01" },
  { id: "h3", name: "ITIL Foundation",  type: "Cred",   completed: "2025-09-10", expires: "2028-09-10" },
];

const Dashboard = () => {
  const [sortBy, setSortBy] = useState<"due-desc" | "due-asc" | "progress" | "name">("due-desc");

  const sortedCerts = useMemo(() => {
    const rows = [...activeCerts];
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
  }, [sortBy]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-green-600">5</p>
            <p className="text-gray-500">Completed Certifications</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-yellow-600">5</p>
            <p className="text-gray-500">Certifications in progress</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border border-gray-300">
            <p className="text-3xl font-bold text-purple-600">5</p>
            <p className="text-gray-500">Total Hours Studied</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="max-w-5xl mx-auto bg-white shadow rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-300">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
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
              <option value="due-desc">Due Date - ▼</option>
              <option value="due-asc">Due Date - ▲</option>
              <option value="progress">Progress</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Active Certs */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
          <div className="space-y-3">
            {sortedCerts.map((c) => (
              <div
                key={c.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3"
              >
                {/* Left: name / type / due */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <strong className="min-w-[200px]">{c.name}</strong>
                  <span className="text-gray-500">{c.type}</span>
                  <span className="text-gray-700">
                    Due {new Date(c.due).toLocaleDateString()}
                  </span>
                </div>

                {/* Right: progress */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 hidden sm:inline">Study progress</span>
                  <div
                    className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(c.progress * 100)}
                  >
                    <div className="h-full bg-green-500" style={{ width: `${c.progress * 100}%` }} />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                    aria-label={`Open ${c.name}`}
                  >
                    ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cert History */}
          <div className="bg-white shadow rounded-lg p-4 border border-gray-300">
            <h3 className="font-semibold mb-3">Certifications</h3>
            <div className="space-y-2">
              {certHistory.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <strong className="min-w-[180px]">{r.name}</strong>
                    <span className="text-gray-500">{r.type}</span>
                    <span className="text-gray-700">
                      Date Completed {new Date(r.completed).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-red-500">
                    Expires {new Date(r.expires).toLocaleDateString()}
                  </span>
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
                <p className="text-gray-500 text-sm">Create study cards from notes (coming soon)</p>
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
