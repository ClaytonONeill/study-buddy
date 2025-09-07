// Modules
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Import your signup function
import { signup } from "../services/auth";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    industry: "",
    user_role: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create payload (excluding password since your signup function doesn't expect it)
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        password: formData.password,
        industry: formData.industry,
        user_role: formData.user_role,
        bio: formData.bio,
      };

      const result = await signup(payload);
      console.log("Signup successful:", result);

      // Reset form or redirect user
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        industry: "",
        user_role: "",
        bio: "",
      });

      navigate("/dashboard");

      // You might want to redirect or show success message here
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center items-center w-fit mx-auto px-6 py-12 lg:px-8 md:border md:border-solid md:border-indigo-600 mt-12 md:rounded-2xl md:shadow-xl">
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="grid-first-name"
              name="first_name"
              type="text"
              placeholder="Jane"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="grid-last-name"
              name="last_name"
              type="text"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-username"
            >
              Username
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="grid-username"
              name="username"
              type="text"
              placeholder="yourusername"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="grid-password"
              name="password"
              type="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-2">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-industry"
            >
              Industry
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                id="grid-industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled hidden>
                  Select Industry
                </option>
                <option value="Industry 1">Industry 1</option>
                <option value="Industry 2">Industry 2</option>
                <option value="Industry 3">Industry 3</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                ▼
              </span>
            </div>
          </div>

          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-role"
            >
              Role
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                id="grid-role"
                name="user_role"
                value={formData.user_role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled hidden>
                  Select Role
                </option>
                <option value="Role 1">Role 1</option>
                <option value="Role 2">Role 2</option>
                <option value="Role 3">Role 3</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                ▼
              </span>
            </div>
          </div>

          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-bio"
            >
              Bio
            </label>
            <textarea
              className="appearance-none block w-full h-72 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              id="grid-bio"
              name="bio"
              placeholder="Tell us about yourself!"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`mt-5 py-2 px-4 rounded cursor-pointer ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
