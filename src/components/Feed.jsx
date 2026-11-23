
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Usercard from "./Usercard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);

  const [filters, setFilters] = useState({
    skills: "",
    location: "",
    sortBy: "newest",
  });

  const feedData = Array.isArray(feed?.Data)
    ? feed.Data
    : Array.isArray(feed)
      ? feed
      : [];

  useEffect(() => {
    if (feedData.length > 0) return;

    let active = true;

    const getFeed = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });

        if (active) {
          dispatch(addFeed(res.data));
        }
      } catch (err) {
        console.error("Feed API Error:", err);

        if (active) {
          if (!err.response) {
            setError("Unable to connect to the server. Check your connection.");
          } else if (err.response.status === 401) {
            setError("Your session has expired. Please log in again.");
          } else {
            setError(
              err.response.data?.message || "Unable to load developers."
            );
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    getFeed();

    return () => {
      active = false;
    };
  }, [dispatch, feedData.length]);

  const filteredFeed = useMemo(() => {
  let result = feedData;
    const query = search.trim().toLowerCase();
    const skillQuery = filters.skills.trim().toLowerCase();
    const locationQuery = filters.location.trim().toLowerCase();

    if (query) {
      result = result.filter((user) =>
        `${user.firstName || ""} ${user.lastName || ""} ${user.about || ""} ${user.skills || ""}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (skillQuery) {
      result = result.filter((user) =>
        String(user.skills || "").toLowerCase().includes(skillQuery)
      );
    }

    if (locationQuery) {
      result = result.filter((user) =>
        String(user.location || "").toLowerCase().includes(locationQuery)
      );
    }

    if (filters.sortBy === "nameAZ") {
      result.sort((a, b) =>
        `${a.firstName} ${a.lastName || ""}`.localeCompare(
          `${b.firstName} ${b.lastName || ""}`
        )
      );
    }

    if (filters.sortBy === "nameZA") {
      result.sort((a, b) =>
        `${b.firstName} ${b.lastName || ""}`.localeCompare(
          `${a.firstName} ${a.lastName || ""}`
        )
      );
    }

    if (filters.sortBy === "oldest") {
      result.reverse();
    }

    return result;
  }, [feedData, search, filters]);

  useEffect(() => {
    setCurrentIndex(0);
    setVisibleCount(9);
  }, [search, filters, viewMode]);

  const resetFilters = () => {
    setSearch("");
    setFilters({
      skills: "",
      location: "",
      sortBy: "newest",
    });
  };

  const refreshFeed = () => {
    dispatch(addFeed([]));
    setError("");
    setLoading(false);
  };

  const activeFilters =
    search || filters.skills || filters.location;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[-10%] h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute right-[-10%] top-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            DEVELOPER COMMUNITY
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Discover{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  developers.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-slate-400">
                Find talented people, explore skills and build your
                professional network.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-white/10 bg-[#111b2d] px-5 py-3">
                <p className="text-2xl font-bold text-white">
                  {filteredFeed.length}
                </p>
                <p className="text-xs text-slate-500">Developers found</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#111b2d] px-5 py-3">
                <p className="text-2xl font-bold text-blue-400">CN</p>
                <p className="text-xs text-slate-500">Community</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Search and controls */}
        <section className="mb-7 rounded-2xl border border-white/10 bg-[#111b2d] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search developers, names or skills..."
                className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  showFilters
                    ? "border-blue-400/30 bg-blue-500/15 text-blue-300"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                ⚙ Filters
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                ▦ Grid
              </button>

              <button
                onClick={() => setViewMode("stack")}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  viewMode === "stack"
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                ▤ Stack
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-3"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Skills
                </label>
                <input
                  value={filters.skills}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      skills: e.target.value,
                    }))
                  }
                  placeholder="React, Java, Python..."
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </label>
                <input
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="City or country..."
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sort profiles
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="nameAZ">Name A-Z</option>
                  <option value="nameZA">Name Z-A</option>
                </select>
              </div>

              <div className="flex items-center justify-between md:col-span-3">
                <p className="text-xs text-slate-500">
                  {filteredFeed.length} matching profiles
                </p>

                <button
                  onClick={resetFilters}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Results heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              People you may know
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore your next professional connection
            </p>
          </div>

          {activeFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-400"
            >
              Reset search
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && feedData.length === 0 && (
          <div className="py-24 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
            <p className="font-semibold text-white">Finding developers...</p>
            <p className="mt-2 text-sm text-slate-500">
              Loading your community
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-10 text-center">
            <p className="text-lg font-bold text-rose-300">
              Unable to load your feed
            </p>
            <p className="mt-3 text-sm text-slate-400">{error}</p>

            <button
              onClick={refreshFeed}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Try again
            </button>
          </div>
        )}

        {/* Profiles */}
        {!loading && !error && feedData.length > 0 && (
          <>
            {filteredFeed.length > 0 ? (
              <>
                {viewMode === "grid" && (
                  <>
                    {/* Spotlight */}
                    <div className="mb-8">
                      <Usercard
                        user={filteredFeed[0]}
                        variant="spotlight"
                      />
                    </div>

                    {/* Grid */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredFeed
                        .slice(1, visibleCount)
                        .map((user, index) => (
                          <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <Usercard user={user} />
                          </motion.div>
                        ))}
                    </div>

                    {visibleCount < filteredFeed.length && (
                      <div className="mt-10 text-center">
                        <button
                          onClick={() =>
                            setVisibleCount((count) => count + 9)
                          }
                          className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
                        >
                          Load more developers →
                        </button>
                      </div>
                    )}
                  </>
                )}

                {viewMode === "stack" && (
                  <div className="mx-auto max-w-3xl">
                    <div className="mb-5 flex items-center justify-between text-sm text-slate-400">
                      <span>
                        Profile {currentIndex + 1} of {filteredFeed.length}
                      </span>
                      <span>Developer discovery</span>
                    </div>

                    <Usercard user={filteredFeed[currentIndex]} />

                    <div className="mt-6 flex justify-between gap-4">
                      <button
                        onClick={() =>
                          setCurrentIndex((index) => Math.max(0, index - 1))
                        }
                        disabled={currentIndex === 0}
                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                      >
                        ← Previous
                      </button>

                      <button
                        onClick={() =>
                          setCurrentIndex((index) =>
                            Math.min(filteredFeed.length - 1, index + 1)
                          )
                        }
                        disabled={currentIndex === filteredFeed.length - 1}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-30"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#111b2d] px-6 py-20 text-center">
                <div className="mb-5 text-5xl text-slate-600">⌕</div>
                <h3 className="text-2xl font-bold text-white">
                  No developers found
                </h3>
                <p className="mt-3 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty feed */}
        {!loading && !error && feedData.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111b2d] px-6 py-20 text-center">
            <div className="mb-5 text-5xl">🌐</div>
            <h3 className="text-2xl font-bold text-white">
              Your network is waiting
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              There are currently no developers available to discover.
            </p>
            <button
              onClick={refreshFeed}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Refresh feed
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default Feed;
