// Modules
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect to home (or login) if no token
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState<null | { username: string }>(null);

  useEffect(() => {
    // On app load, check if token exists
    const token = localStorage.getItem("token");
    if (token) {
      // Ideally decode token here and extract user info
      setUser({ username: "placeholder" });
    }
  }, []);

  return (
    <div>
      <Header user={user} setUser={setUser} />{" "}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
