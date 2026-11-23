
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/feed", label: "Discover", icon: "⌕" },
  { path: "/profile", label: "Profile", icon: "◉" },
  { path: "/connections", label: "Network", icon: "♧" },
  { path: "/requestreceived", label: "Requests", icon: "✉" },
];

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, {
        withCredentials: true,
      });
      dispatch(removeUser());
      setMobileOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-500/15 text-blue-300 border border-blue-400/20"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 backdrop-blur-2xl shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between px-5 md:px-7 py-3">

            {/* Brand */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-sm">CN</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Connect<span className="text-blue-400">Now</span>
                </span>
                <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase">
                  Developer Network
                </p>
              </div>
            </Link>

            {/* Public navigation */}
            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Desktop navigation */}
            {user && (
              <div className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={navLinkClass(item.path)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* User section */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    {user.firstName?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-semibold text-white">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-emerald-400">
                      ● Account
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 text-sm font-medium transition"
                >
                  Logout ↗
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                aria-label="Toggle navigation"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 left-4 right-4 z-40 lg:hidden rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition ${
                    isActive(item.path)
                      ? "bg-blue-500/15 text-blue-300"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between">
                <span className="text-sm text-white font-medium">
                  {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Space below fixed navbar */}
      <div className="h-28" />
    </>
  );
}

export default Navbar;
