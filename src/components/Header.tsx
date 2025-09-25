// Modules
import { useSignout } from "../services/auth";
import { useNavigate } from "react-router-dom";

// The props that the header can be is a user, which can be either of type User or null.
interface HeaderProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// User types contain a username, which must be a string.
// This may need to be updated as we build out the user type.
interface User {
  username: string;
}

const Header = ({ user, setUser }: HeaderProps) => {
  const signout = useSignout(setUser);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl px-3 py-2 rounded-lg">
              S.B
            </div>
          </div>

          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Hello {user.username}
                </span>
                <button
                  onClick= {() => navigate("/user-profile")}
                  className="bg-blue-600 text-black-500 hover:text-black-700 px-3 py-1 rounded-md text-sm transition-colors duration-200 hover:cursor-pointer"
                >
                  Profile
                </button>
                <button
                  onClick={signout}
                  className="bg-gray-200 text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md text-sm transition-colors duration-200 hover:cursor-pointer"
                >
                  Sign Out
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
