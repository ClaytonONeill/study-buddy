import React, { useState } from "react";

type Industry = "" | "tech" | "finance" | "healthcare";
type Path = "" | "programming" | "accounting" | "cybersecurity";

const UserProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState("User");
  const [lastName, setLastName] = useState("Name");
  const [industry, setIndustry] = useState<Industry>("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [email] = useState("user@mail.com");
  const [path, setPath] = useState<Path>("");
  const [avatarUrl] = useState(
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
  );

  return (
    <div className="min-h-screen w-full ">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-600/70  dark:shadow-black/20">
          <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-[1px]">
            <div className="rounded-t-2xl bg-white/70 px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                User Profile
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 px-6 pb-6 pt-4 md:grid-cols-12 md:gap-10">
            {/* Avatar */}
            <section className="md:col-span-4">
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-36 w-36 rounded-full object-cover shadow-md ring-4 ring-white dark:ring-slate-900 md:h-40 md:w-40 xl:h-48 xl:w-48"
                  />
                </div>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:shadow transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  type="button"
                >
                  Change photo
                </button>
              </div>
            </section>

            {/* Fields */}
            <section className="md:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="First Name">
                  <input
                    className="input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormField>

                <FormField label="Last Name">
                  <input
                    className="input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormField>

                <FormField label="Industry">
                  <select
                    className="input"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry)}
                  >
                    <option value="">Select…</option>
                    <option value="tech">Tech</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </FormField>

                <FormField label="Role">
                  <input
                    className="input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </FormField>

                <FormField label="Email">
                  <input
                    className="input bg-slate-50 "
                    value={email}
                    readOnly
                    aria-readonly
                  />
                </FormField>

                <FormField label="Path">
                  <select
                    className="input"
                    value={path}
                    onChange={(e) => setPath(e.target.value as Path)}
                  >
                    <option value="">Select…</option>
                    <option value="programming">Programming</option>
                    <option value="accounting">Accounting</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
                </FormField>
              </div>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

              {/* Bio */}
              <FormField label="Bio" full>
                <textarea
                  className="input h-38 md:h-46 w-full"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </FormField>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-red-600 px-5 py-2.5 text-white
                  font-medium shadow-sm transition hover:bg-red-700 active:bg-red-800 focus:outline-none
                  focus:ring focus:ring-red-200"
                  type="button"
                  onClick={() => alert("Delete account")}
                >
                  Delete Account
                </button>
                <button
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-green-600 px-5 py-2.5 text-white
                  font-medium shadow-sm transition hover:bg-green-700 active:bg-green-800 focus:outline-none
                  focus:ring focus:ring-green-200"
                  type="button"
                  onClick={() => alert("Saved!")}
                >
                  Save Changes
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

type FormFieldProps = {
  label: string;
  full?: boolean;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, full, children }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-500">
      {label}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

export default UserProfilePage;

