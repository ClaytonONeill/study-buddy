// Modules
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Header user={null} />{" "}
      {/* TODO: Update with actual user when logic is wired up */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes - TODO: Integrate cookie based state validation */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
