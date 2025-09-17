import { useNavigate } from "react-router-dom";

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Login failed");

  const signInData = await res.json();

  // Store the JWT in localStorage
  localStorage.setItem("token", signInData.token);

  console.log("Successful sign in!");
  return signInData;
}

// For signup
export async function signup(payload: {
  first_name: string;
  last_name: string;
  username: string;
  industry: string;
  user_role: string;
  bio?: string;
}) {
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Signup failed");

  const signUpData = await res.json();

  localStorage.setItem("token", signUpData.token);

  console.log("Successful sign up!");
  return signUpData;
}

export function useSignout(setUser: React.Dispatch<React.SetStateAction<any>>) {
  console.log("hitting this?");

  const navigate = useNavigate();

  function signout() {
    // Remove JWT from storage
    localStorage.removeItem("token");

    // Clear auth state
    setUser(null);

    // Redirect home
    navigate("/");
  }

  return signout;
}
