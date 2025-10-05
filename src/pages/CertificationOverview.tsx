// Modules
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Services
import { updateUserCertification } from "../services/userActions";

// Utilities
import { formatLevel } from "../utilities/utils";

type Cert = {
  id: string;
  name: string;
  provider?: string;
  level?: string;
  description?: string;
};

type LocationState = Cert | undefined;

const CertificationOverviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get cert data from navigation state
  const {
    ce_hours_completed,
    ce_hours_required,
    cert_level,
    description,
    earned_on,
    expires_on,
    title,
    user_cert_id,
  } = location.state?.cert;

  // Manual fields for now (static)
  const [dateCompleted, setDateCompleted] = useState<string>("");
  const [dateExpires, setDateExpires] = useState<string>("");
  const [ceHoursNeeded, setCeHoursNeeded] = useState<string>("");
  const [ceHoursComplete, setCeHoursComplete] = useState<string>("");

  if (!user_cert_id) {
    // Redirect message if no cert is provided
    return (
      <div className="p-6">
        <h2>No certification data provided.</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Back */}
      <div className="mb-4">
        <Link className="underline" to="/">
          ← Back
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 shadow-xl shadow-slate-200/40 backdrop-blur">
        {/* Header with Cert Name */}
        <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-[1px]">
          <div className="rounded-t-2xl bg-white/70 px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {`${title} - ${formatLevel(cert_level)}`}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2">
          {/* Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date Completed">
              <input
                type="date"
                className="input"
                value={earned_on}
                onChange={(e) => setDateCompleted(e.target.value)}
              />
            </FormField>

            <FormField label="Date Expires">
              <input
                type="date"
                className="input"
                value={expires_on}
                onChange={(e) => setDateExpires(e.target.value)}
              />
            </FormField>

            <FormField label="CE Hours Needed">
              <input
                type="number"
                className="input"
                min="0"
                step="0.5"
                placeholder="e.g., 20"
                value={ce_hours_required}
                onChange={(e) => setCeHoursNeeded(e.target.value)}
              />
            </FormField>

            <FormField label="CE Hours Complete">
              <input
                type="number"
                className="input"
                min="0"
                step="0.5"
                placeholder="e.g., 20"
                value={ce_hours_completed}
                onChange={(e) => setCeHoursComplete(e.target.value)}
              />
            </FormField>
          </div>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

          {/* Description */}
          <section className="sm:col-span-2 rounded-xl border border-slate-200 p-4 bg-white/70 mb-6">
            <h2 className="font-medium mb-2">Description</h2>
            <p
              className="text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          </section>

          {/* Flashcards Placeholder */}
          <section className="sm:col-span-2 rounded-xl border border-slate-200 p-6 bg-white/70 h-80">
            <h2 className="font-medium mb-3">Flashcards</h2>
            <p className="text-sm text-slate-700">
              Placeholder for flashcard module. This will display study cards
              once implemented.
            </p>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-green-600 px-5 py-2.5 text-white
              font-medium shadow-sm transition hover:bg-green-700 active:bg-green-800 focus:outline-none
              focus:ring focus:ring-green-200 hover:cursor-pointer"
              type="button"
              onClick={() => alert("Saved (stub)")}
            >
              Save
            </button>
            <button
              className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-red-600 px-5 py-2.5 text-white
              font-medium shadow-sm transition hover:bg-red-700 active:bg-red-800 focus:outline-none
              focus:ring focus:ring-red-200 hover:cursor-pointer"
              type="button"
              onClick={() => alert("Reset (stub)")}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-500">
      {label}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

export default CertificationOverviewPage;
