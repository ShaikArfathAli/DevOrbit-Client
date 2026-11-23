
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Connections = () => {
  const connectionsData = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });

        dispatch(addConnections(res.data?.Data || []));
      } catch (err) {
        console.error("Error fetching connections:", err);

        if (!err.response) {
          setError("Unable to connect to the server. Check your connection.");
        } else if (err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load your connections. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [dispatch]);

  const connections = Array.isArray(connectionsData)
    ? connectionsData
    : [];

  const filteredConnections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = connections.filter((user) => {
      const name = `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.toLowerCase();

      const about = (user?.about || "").toLowerCase();

      const skills = Array.isArray(user?.skills)
        ? user.skills.join(" ").toLowerCase()
        : (user?.skills || "").toLowerCase();

      return (
        name.includes(query) ||
        about.includes(query) ||
        skills.includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a?.firstName || "").localeCompare(b?.firstName || "");
        case "age":
          return (a?.age || 0) - (b?.age || 0);
        case "recent":
          return (
            new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
          );
        default:
          return 0;
      }
    });
  }, [connections, searchTerm, sortBy]);

  const getSkills = (skills) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    }
    return [];
  };

  const getInitials = (user) => {
    return `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase() || "D";
  };

  const ProfileAvatar = ({ user, size = "large" }) => {
    const sizeClass =
      size === "small" ? "w-14 h-14 text-lg" : "w-20 h-20 text-2xl";

    return (
      <div
        className={`${sizeClass} shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={`${user.firstName || "Developer"} profile`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          getInitials(user)
        )}
      </div>
    );
  };

  const SkillTags = ({ skills, limit = 3 }) => {
    const items = getSkills(skills);

    if (!items.length) {
      return (
        <p className="text-xs text-slate-500">No skills added yet</p>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.slice(0, limit).map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-400/20 text-blue-300"
          >
            {skill}
          </span>
        ))}

        {items.length > limit && (
          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-400">
            +{items.length - limit}
          </span>
        )}
      </div>
    );
  };

  const ConnectionCard = ({ user, index, list = false }) => (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => setSelectedConnection(user)}
      className={`group bg-[#151d30] border border-slate-700/60 rounded-2xl hover:border-blue-500/50 hover:bg-[#19243a] transition-all duration-300 cursor-pointer ${
        list ? "p-5" : "p-6"
      }`}
    >
      <div className={list ? "flex items-center gap-5" : "flex flex-col"}>
        <div
          className={`flex items-center ${
            list ? "" : "flex-col text-center"
          } gap-4`}
        >
          <div className="relative">
            <ProfileAvatar user={user} size={list ? "small" : "large"} />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-[#151d30]" />
          </div>

          <div className={list ? "min-w-0 flex-1" : "w-full"}>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              {user?.firstName} {user?.lastName}
            </h3>

            {user?.age && (
              <p className="text-xs text-slate-500 mt-1">
                {user.age} years old
              </p>
            )}

            {!list && (
              <p className="text-sm text-slate-400 mt-3 line-clamp-2 min-h-10">
                {user?.about || "Developer and technology enthusiast."}
              </p>
            )}
          </div>
        </div>

        {list ? (
          <div className="hidden md:block flex-1 min-w-0">
            <p className="text-sm text-slate-400 line-clamp-1 mb-2">
              {user?.about || "Developer and technology enthusiast."}
            </p>
            <SkillTags skills={user?.skills} limit={4} />
          </div>
        ) : (
          <div className="mt-5 min-h-8">
            <SkillTags skills={user?.skills} limit={3} />
          </div>
        )}

        <div
          className={`flex gap-2 ${
            list ? "ml-auto shrink-0" : "mt-6"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/${user._id}`);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Message
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedConnection(user);
            }}
            title="View profile details"
            className="px-3 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );

  return (
    <div className="min-h-screen bg-[#090d19] text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <motion.section
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            YOUR PROFESSIONAL NETWORK
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Connections.</span>
              </h1>
              <p className="text-slate-400 mt-3 text-base md:text-lg max-w-2xl">
                Stay connected with developers, exchange ideas and build
                meaningful professional relationships.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-[#151d30] border border-slate-700/60 rounded-2xl px-5 py-4 min-w-32">
                <p className="text-2xl font-bold text-white">
                  {connections.length}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total connections</p>
              </div>
              <div className="bg-[#151d30] border border-slate-700/60 rounded-2xl px-5 py-4 min-w-32">
                <p className="text-2xl font-bold text-blue-400">CN</p>
                <p className="text-xs text-slate-400 mt-1">Developer network</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Search and controls */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#151d30] border border-slate-700/60 rounded-2xl p-4 md:p-5 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="m20 20-4-4" strokeWidth="2" />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, skills or expertise..."
                className="w-full bg-[#090d19] border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 min-w-36 bg-[#090d19] border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="name">Name: A to Z</option>
                <option value="age">Age: Low to High</option>
                <option value="recent">Recently Added</option>
              </select>

              <div className="flex bg-[#090d19] border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ▦ Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <span>
              Showing {filteredConnections.length} of {connections.length} connections
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </motion.section>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 mt-5">Loading your network...</p>
          </div>
        ) : error ? (
          <div className="bg-[#151d30] border border-red-500/20 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">!</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Couldn't load connections
            </h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Try again
            </button>
          </div>
        ) : filteredConnections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#151d30] border border-slate-700/60 rounded-2xl px-6 py-20 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-3xl">
              {searchTerm ? "⌕" : "◇"}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              {searchTerm ? "No matching connections" : "Your network starts here"}
            </h2>

            <p className="text-slate-400 max-w-md mx-auto mb-7">
              {searchTerm
                ? "Try another name or skill, or clear your search."
                : "Discover developers, send connection requests and grow your professional network."}
            </p>

            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => navigate("/feed")}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Discover developers
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.section
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  : "flex flex-col gap-4"
              }
            >
              {filteredConnections.map((user, index) => (
                <ConnectionCard
                  key={user?._id || index}
                  user={user}
                  index={index}
                  list={viewMode === "list"}
                />
              ))}
            </motion.section>
          </AnimatePresence>
        )}

        {/* Connection detail modal */}
        <AnimatePresence>
          {selectedConnection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConnection(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-[#151d30] border border-slate-700 rounded-3xl p-7 shadow-2xl"
              >
                <button
                  onClick={() => setSelectedConnection(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xl"
                  aria-label="Close profile"
                >
                  ×
                </button>

                <div className="flex flex-col items-center text-center">
                  <ProfileAvatar user={selectedConnection} />

                  <h2 className="text-2xl font-bold text-white mt-5">
                    {selectedConnection.firstName} {selectedConnection.lastName}
                  </h2>

                  {selectedConnection.age && (
                    <p className="text-sm text-slate-400 mt-2">
                      {selectedConnection.age} years old
                    </p>
                  )}

                  <p className="text-slate-300 leading-relaxed mt-5">
                    {selectedConnection.about || "No description available."}
                  </p>

                  <div className="w-full mt-6 text-left">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">
                      Skills
                    </h3>
                    <SkillTags
                      skills={selectedConnection.skills}
                      limit={20}
                    />
                  </div>

                  <button
                    onClick={() => {
                      const id = selectedConnection._id;
                      setSelectedConnection(null);
                      navigate(`/chat/${id}`);
                    }}
                    className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                  >
                    Start a conversation
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Connections;
