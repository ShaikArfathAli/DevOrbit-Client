
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromFeed, addUserToFeed } from "../utils/feedSlice";
import { addToast } from "../utils/notificationsSlice";
import { Link } from "react-router-dom";

const Usercard = ({ user, variant = "grid" }) => {
  const { _id, photoUrl, firstName, lastName, about, skills } = user;

  const dispatch = useDispatch();
  const [responseStatus, setResponseStatus] = useState(null);
  const [reqInfo, setReqInfo] = useState(user.requestInfo || null);
  const [withdrawing, setWithdrawing] = useState(false);

  const isSpotlight = variant === "spotlight";

  const skillList = Array.isArray(skills)
    ? skills
    : String(skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  const handleSendRequest = async (status, userId) => {
    if (reqInfo || responseStatus) return;

    setResponseStatus(status === "interested" ? "Interested" : "Ignored");
    dispatch(removeFromFeed(userId));

    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(
        addToast(
          status === "interested"
            ? "Connection request sent!"
            : "Profile ignored",
          "success",
          2500
        )
      );
    } catch (err) {
      console.error("Error in request:", err);

      dispatch(addUserToFeed(user));
      setResponseStatus(null);

      let errorMessage = "Failed to send request. Please try again.";

      if (!err.response) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.response.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response.status === 400) {
        errorMessage =
          err.response.data?.message || "Invalid request.";
      } else if (err.response.status === 409) {
        errorMessage = "You've already sent a request to this user.";
      } else if (err.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = err.response.data?.message || errorMessage;
      }

      dispatch(addToast(errorMessage, "error", 3500));
    }
  };

  const handleWithdraw = async () => {
    if (withdrawing) return;

    try {
      setWithdrawing(true);

      await axios.delete(`${BASE_URL}/request/withdraw/${_id}`, {
        withCredentials: true,
      });

      setReqInfo(null);
      setResponseStatus(null);

      dispatch(addToast("Request withdrawn successfully", "success", 2500));
    } catch (err) {
      console.error("Error withdrawing request:", err);

      let errorMessage = "Failed to withdraw request.";

      if (!err.response) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.response.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response.status === 404) {
        errorMessage = "Request not found or already withdrawn.";
      } else if (err.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = err.response.data?.message || errorMessage;
      }

      dispatch(addToast(errorMessage, "error", 3500));
    } finally {
      setWithdrawing(false);
    }
  };

  const Avatar = (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 ${
        isSpotlight
          ? "mx-auto mb-5 h-28 w-28 md:mx-0 md:mb-0 md:h-32 md:w-32"
          : "mx-auto mb-4 h-20 w-20 md:mx-0 md:mb-0"
      }`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName || ""}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-300">
          {firstName?.[0]?.toUpperCase() || "?"}
        </div>
      )}

      <span className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#111a2b] bg-emerald-400" />
    </div>
  );

  const Skills = (
    <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
      {skillList.length > 0 ? (
        skillList.slice(0, 6).map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded-lg border border-blue-400/15 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300"
          >
            {skill}
          </span>
        ))
      ) : (
        <span className="text-xs text-slate-500">No skills added yet</span>
      )}
    </div>
  );

  const StatusBanner = responseStatus && (
    <div
      className={`mb-4 rounded-xl border p-3 text-sm ${
        responseStatus === "Interested"
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-slate-400/20 bg-slate-400/10 text-slate-400"
      }`}
    >
      {responseStatus === "Interested"
        ? "✓ Connection request sent"
        : "Profile ignored"}
    </div>
  );

  const Actions = (
    <div className="flex flex-wrap gap-3">
      {reqInfo && reqInfo.status === "interested" ? (
        reqInfo.direction === "outgoing" ? (
          <>
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="flex-1 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {withdrawing ? "Withdrawing..." : "Withdraw"}
            </button>

            <button
              disabled
              className="flex-1 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300"
            >
              Pending
            </button>
          </>
        ) : (
          <>
            <button
              disabled
              className="flex-1 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300"
            >
              Pending
            </button>

            <Link
              to="/requestreceived"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Review request
            </Link>
          </>
        )
      ) : (
        <>
          <button
            onClick={() => handleSendRequest("ignore", _id)}
            disabled={responseStatus !== null}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {responseStatus === "Ignored" ? "Ignored" : "Ignore"}
          </button>

          <button
            onClick={() => handleSendRequest("interested", _id)}
            disabled={responseStatus !== null}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {responseStatus === "Interested" ? "Request Sent" : "Interested"}
          </button>
        </>
      )}
    </div>
  );

  if (isSpotlight) {
    return (
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#17243a] to-[#101827] p-7 shadow-2xl shadow-black/20 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[90px]" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-start md:gap-8">
          {Avatar}

          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-300">
                Featured developer
              </span>
              <span className="text-xs text-emerald-400">● Available to connect</span>
            </div>

            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white">
              {firstName} {lastName}
            </h2>

            {Skills}

            <p className="mb-5 max-w-2xl text-sm leading-7 text-slate-400">
              {about || "This developer hasn't added a description yet."}
            </p>

            {StatusBanner}
            {Actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#111b2d] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-950/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition group-hover:bg-blue-500/15" />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-4 md:text-left">
          {Avatar}

          <div className="min-w-0 flex-1">
            <h2 className="mb-1 text-xl font-bold text-white">
              {firstName} {lastName}
            </h2>

            <p className="mb-4 text-xs text-slate-500">
              Developer on ConnectNow
            </p>
          </div>
        </div>

        <div className="mt-5 flex-1">
          {Skills}

          <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-400">
            {about || "This developer hasn't added a description yet."}
          </p>
        </div>

        {StatusBanner}

        <div className="relative mt-auto border-t border-white/5 pt-4">
          {Actions}
        </div>
      </div>
    </div>
  );
};

Usercard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photoUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    about: PropTypes.string,
    skills: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    requestInfo: PropTypes.shape({
      exists: PropTypes.bool,
      status: PropTypes.string,
      direction: PropTypes.string,
      requestId: PropTypes.string,
    }),
  }).isRequired,
  variant: PropTypes.oneOf(["grid", "spotlight"]),
};

export default Usercard;
