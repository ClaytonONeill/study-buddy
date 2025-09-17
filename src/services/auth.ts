// Modules
import { useNavigate } from "react-router-dom";

// Services
import { getUserFromToken } from "./jwtDecode";

export async function login(
  payload: { username: string; password: string },
  setUser: React.Dispatch<React.SetStateAction<any>>
) {
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  localStorage.setItem("token", data.token);

  // update user immediately
  const user = getUserFromToken(data.token);
  setUser(user);

  return data;
}

// For signup
export async function signup(
  payload: {
    first_name: string;
    last_name: string;
    username: string;
    industry: string;
    user_role: string;
    bio?: string;
  },
  setUser: React.Dispatch<React.SetStateAction<any>>
) {
  const res = await fetch(
    "https://p9iuv4325d.execute-api.us-east-1.amazonaws.com/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Signup failed");

  const data = await res.json();

  // Save the JWT
  localStorage.setItem("token", data.token);

  // Update user state immediately
  const user = getUserFromToken(data.token);
  setUser(user);

  console.log("Signup successful!");
  return data;
}

export function useSignout(setUser: React.Dispatch<React.SetStateAction<any>>) {
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
