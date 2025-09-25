// Modules
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";

// Services
import { getUserFromToken } from "./services/jwtDecode";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfilePage";
import CertificationOverviewPage from "./pages/CertificationOverview";


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
    const token = localStorage.getItem("token");
    if (token) {
      setUser(getUserFromToken(token));
    }
  }, []);

  return (
    <div>
      <Header user={user} setUser={setUser} />{" "}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          
        />
 <Route
          path="/user-profile"  
          element={
            <ProtectedRoute>
              <UserProfile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/certs"  
          element={
            <ProtectedRoute>
              <CertificationOverviewPage/>
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
