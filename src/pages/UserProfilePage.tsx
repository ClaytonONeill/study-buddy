import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfileData } from "../services/userActions";

type FormState = {
  firstName: string;
  lastName: string;
  industry: string;
  role: string;
  bio: string;
  avatarUrl: string; 
};
 const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<FormState> | null>(null);

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const resp = await getUserProfileData();

        let raw: any;
        if (resp?.body && typeof resp.body === "string") raw = JSON.parse(resp.body);
        else if (typeof resp === "string") raw = JSON.parse(resp);
        else raw = resp ?? {};

        setProfile({
          firstName: raw.firstName ?? raw.first_name ?? "User",
          lastName: raw.lastName ?? raw.last_name ?? "Name",
          industry: raw.industry ?? "",
          role: raw.user_role ?? raw.role ?? raw.userRole ?? "",
          bio: raw.bio ?? "",
          avatarUrl:
            raw.avatarUrl ??
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initialForm = useMemo<FormState>(() => {
    return {
      firstName: profile?.firstName ?? "User",
      lastName: profile?.lastName ?? "Name",
      industry: profile?.industry ?? "",
      role: profile?.role ?? "",
      bio: profile?.bio ?? "",
      avatarUrl:
        profile?.avatarUrl ??
        "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    };
  }, [profile]);

  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleBack = () => navigate("/dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-700 font-medium">
          {error || "Could not load profile."}
        </div>
      </div>
    );
  }
       
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
                     src={form.avatarUrl}
                     alt="Profile"
                     className="h-36 w-36 rounded-full object-cover shadow-md ring-4 ring-white dark:ring-slate-900 md:h-40 md:w-40 xl:h-48 xl:w-48"
                    />
                 </div>
              </div>
            </section>

            {/* Fields */}
            <section className="md:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <FormField label="First Name">
                <input
                  className="input"
                  value={form.firstName}
                   readOnly
                  />
                </FormField>

                <FormField label="Last Name">
                  <input
                    className="input"
                    value={form.lastName}
                    readOnly
                  />
                </FormField>

                <FormField label="Industry">
                  <input
                   className="input"
                   value={form.industry}
                   placeholder="e.g., Manufacturing, Tech, Finance"
                   readOnly
                  />
                </FormField>

                <FormField label="Role">
                  <input
                    className="input"
                    value={form.role}
                    placeholder="e.g., Software Engineer"
                    readOnly
                  />
                </FormField>
              </div>

              {/* Divider */}
              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />

              {/* Bio */}
              <FormField label="Bio" full>
                <textarea
                  className="input h-38 md:h-46 w-full"
                  value={form.bio}
                  placeholder="Tell us about yourself..."
                  
                />
              </FormField>

              {/* Back Button */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-end">
                <button
                  className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-gray-700 px-5 py-2.5 text-white
                     font-medium shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-200"
                   type="button"
                onClick={handleBack}
              >
                ← Back
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

