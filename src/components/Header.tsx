import { useState } from "react";

interface User {
  username: string;
}

const Header: React.FC = () => {
  // Simulate user state - in a real app this would come from your auth context/state
  const [user, setUser] = useState<User | null>({ username: "john_doe" });

  const handleSignOut = () => {
    setUser(null);
  };

  const handleSignIn = () => {
    setUser({ username: "john_doe" });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl px-3 py-2 rounded-lg">
              Logo Placeholder
            </div>
          </div>

          {/* User Greeting or Sign In */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Hello {user.username}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
