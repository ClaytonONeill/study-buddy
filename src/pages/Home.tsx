// Modules
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

// Auth
import { login } from "../services/auth";

const Home = () => {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  // Rate limiting
  const MAX_ATTEMPTS = 5;
  const isRateLimited = attemptCount >= MAX_ATTEMPTS;

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;

    if (error) setError("");

    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!loginFormData.username.trim()) {
      setError("Username is required");
      return false;
    }

    if (!loginFormData.password) {
      setError("Password is required");
      return false;
    }

    if (loginFormData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRateLimited) {
      setError("Too many failed attempts. Please wait before trying again.");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        username: loginFormData.username.trim(), // Trim whitespace
        password: loginFormData.password,
      };

      const result = await login(payload);
      console.log("Sign in successful:", result);

      // Clear form and reset attempt counter on success
      setLoginFormData({
        username: "",
        password: "",
      });
      setAttemptCount(0);

      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
      setAttemptCount((prev) => prev + 1);

      setError("Invalid username or password. Please try again.");

      // Clear password field on failed attempt
      setLoginFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-4xl font-bold tracking-tight text-black">
            Welcome to Study Buddy!
          </h1>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {isRateLimited && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              Account temporarily locked due to multiple failed attempts.
            </div>
          )}

          <form
            action="#"
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-black"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={loginFormData.username}
                  required
                  autoComplete="username"
                  maxLength={255}
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  onChange={handleInputChange}
                  disabled={isRateLimited}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-black"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginFormData.password}
                  required
                  autoComplete="current-password"
                  maxLength={255}
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  onChange={handleInputChange}
                  disabled={isRateLimited}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer ${
                  isLoading || isRateLimited ? "bg-gray-400" : "bg-indigo-500"
                }`}
                disabled={isLoading || isRateLimited}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-lg text-slate-600">
            Not a member?
          </p>
          <Link
            to="/signup"
            className="bg-green-500 text-white py-2 px-4 rounded flex m-auto mt-2 hover:bg-green-600 cursor-pointer w-fit"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
