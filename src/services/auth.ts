// TODO: These both need to be wired into their respective pages:
export async function login(email: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// For signup
export async function signup(payload: {
  email: string;
  password: string;
  industry: string;
  role: string;
  bio: string;
}) {
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}
