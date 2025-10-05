// Modules
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";

// Services
import { getUserFromToken } from "./services/jwtDecode";
import { getUserProfileData } from "./services/userActions";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddCertification from "./pages/AddCertification";
import UserProfile from "./pages/UserProfilePage";
import CertificationOverviewPage from "./pages/CertificationOverview";

// Types
import type { UserProfile as UserProfileType } from "./types/UserProfile";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect to home (or login) if no token
    return <Navigate to="/" replace />;
  }
  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (token) {
    // Redirect to dashboard if user is already signed in
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [user, setUser] = useState<null | { username: string }>(null);

  // On mount, decode token and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(getUserFromToken(token));
    }
  }, []);

  // Fetch user profile and certs when user is set
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }
      try {
        // Fetch and parse user profile
        const profileResp = await getUserProfileData();
        let parsedProfile: UserProfileType | null = null;
        if (profileResp?.body && typeof profileResp.body === "string") {
          parsedProfile = JSON.parse(profileResp.body);
        } else if (typeof profileResp === "string") {
          parsedProfile = JSON.parse(profileResp);
        } else {
          parsedProfile = profileResp;
        }
        setUserProfile(parsedProfile);
      } catch (err) {
        setUserProfile(null);
      } finally {
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* Public Routes - redirect to dashboard if signed in */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home setUser={setUser} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup setUser={setUser} />
            </PublicRoute>
          }
        />
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
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certs:id"
          element={
            <ProtectedRoute>
              <CertificationOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addCertification"
          element={
            <ProtectedRoute>
              {userProfile ? (
                <AddCertification userProfile={userProfile} />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-xl font-semibold animate-pulse">
                    Loading...
                  </div>
                </div>
              )}
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
