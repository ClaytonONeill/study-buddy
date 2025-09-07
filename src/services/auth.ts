// TODO: These both need to be wired into their respective pages:
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
  else console.log("Successful sign in!");
  return res.json();
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
  else console.log(`Success! ${res}`);
  return res.json();
}
