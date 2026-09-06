import { Link, useNavigate } from "react-router";
import {
  PlusIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Logout
  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-[#050406] via-[#1b1020] to-[#251422] border-b-2 border-[#D4AF37] shadow-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/notes">
            <h1 className="text-3xl font-bold font-mono tracking-tight text-orange-300">
              ThinkNotes
            </h1>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* User Information */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-orange-100">
                <UserIcon className="size-5 text-orange-300" />

                <span className="font-medium">
                  {user.userName || user.email}
                </span>
              </div>
            )}

            {/* New Note */}
            <Link
              to="/create"
              className="btn btn-primary bg-orange-300 border-orange-300 hover:bg-orange-400 hover:border-orange-400"
            >
              <PlusIcon className="size-5" />
              <span className="hidden sm:inline">
                New Note
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn btn-outline border-orange-300 text-orange-300 hover:bg-orange-300 hover:text-black"
            >
              <LogOutIcon className="size-5" />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;