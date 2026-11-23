
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const features = [
  {
    icon: "⌕",
    title: "Discover developers",
    description:
      "Explore developer profiles, discover new skills and find people who share your interests.",
    link: "/feed",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: "♧",
    title: "Build your network",
    description:
      "Connect with talented professionals and build meaningful relationships.",
    link: "/connections",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: "✉",
    title: "Real-time conversations",
    description:
      "Chat with your connections and exchange ideas in real time.",
    link: "/connections",
    color: "from-emerald-500 to-teal-400",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your identity",
    description:
      "Build your developer profile and showcase your skills, interests and experience.",
  },
  {
    number: "02",
    title: "Find your people",
    description:
      "Discover developers, explore profiles and connect with people who inspire you.",
  },
  {
    number: "03",
    title: "Grow together",
    description:
      "Start conversations, exchange knowledge and build your professional network.",
  },
];

const Home = () => {
  const user = useSelector((state) => state.user);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] text-white">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* Hero section */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10 lg:pt-24">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Your developer community starts here
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl xl:text-7xl">
            {user?.firstName ? (
              <>
                Welcome back,
                <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  {user.firstName}.
                </span>
              </>
            ) : (
              <>
                Your next
                <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                  connection
                </span>
                starts here.
              </>
            )}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Great things happen when developers connect. Discover talented
            people, showcase your skills, exchange ideas and grow together
            with ConnectNow.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/feed"
              className="group flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Explore developers
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to={user ? "/profile" : "/signup"}
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-slate-200 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
            >
              {user ? "View your profile" : "Join ConnectNow"}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <span><span className="text-emerald-400">✓</span> Developer profiles</span>
            <span><span className="text-emerald-400">✓</span> Professional networking</span>
            <span><span className="text-emerald-400">✓</span> Live messaging</span>
          </div>
        </motion.div>

        {/* Developer network illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute inset-8 rounded-full bg-blue-500/20 blur-[90px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#141f36] to-[#0c1324] p-7 shadow-2xl shadow-black/40 sm:p-10">

            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  ConnectNow
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Developer universe
                </h2>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">
                ● Connected
              </div>
            </div>

            <div className="relative flex aspect-square items-center justify-center">

              {/* Orbit circles */}
              <div className="absolute h-[85%] w-[85%] rounded-full border border-blue-400/10" />
              <div className="absolute h-[62%] w-[62%] rounded-full border border-violet-400/20" />
              <div className="absolute h-[38%] w-[38%] rounded-full border border-cyan-400/20" />

              {/* Connection lines - corrected SVG */}
              <svg
                viewBox="0 0 400 400"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <g
                  fill="none"
                  stroke="#64748b"
                  strokeOpacity=".55"
                  strokeWidth="2"
                >
                  <path d="M200 200 L80 95" />
                  <path d="M200 200 L315 90" />
                  <path d="M200 200 L85 315" />
                  <path d="M200 200 L325 300" />
                  <path d="M80 95 L315 90" />
                  <path d="M85 315 L325 300" />
                </g>
              </svg>

              {/* Center logo */}
              <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-3xl border border-blue-300/30 bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-500/40">
                <span className="text-3xl font-black">CN</span>
                <span className="mt-1 text-[9px] font-semibold tracking-widest text-blue-100">
                  CONNECTNOW
                </span>
              </div>

              {/* Developer nodes */}
              {[
                {
                  position: "left-[8%] top-[16%]",
                  initials: "JD",
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  position: "right-[8%] top-[15%]",
                  initials: "AK",
                  color: "from-violet-500 to-purple-600",
                },
                {
                  position: "left-[9%] bottom-[15%]",
                  initials: "SR",
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  position: "right-[8%] bottom-[15%]",
                  initials: "MK",
                  color: "from-orange-500 to-pink-600",
                },
              ].map((person) => (
                <div
                  key={person.initials}
                  className={`absolute ${person.position} z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br ${person.color} text-sm font-bold shadow-xl sm:h-16 sm:w-16`}
                >
                  {person.initials}
                </div>
              ))}
            </div>

            {/* Illustration footer */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                ["Discover", "Find talent"],
                ["Connect", "Build bonds"],
                ["Collaborate", "Share ideas"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/5 bg-white/[0.04] p-3 text-center"
                >
                  <p className="text-sm font-semibold text-slate-200">
                    {title}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-4 top-1/4 hidden rounded-xl border border-white/10 bg-[#151f32] px-4 py-3 shadow-xl sm:block">
            <p className="text-xs text-slate-500">Your next opportunity</p>
            <p className="mt-1 text-sm font-semibold text-blue-300">
              Starts with a connection ↗
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative border-t border-white/5 bg-white/[0.015] px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                What you can do
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Everything starts with a connection.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              A space designed to help developers discover one another,
              exchange knowledge and build meaningful professional
              relationships.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <Link
                  to={feature.link}
                  className="group block h-full rounded-2xl border border-white/10 bg-[#101827]/80 p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-[#151f32]"
                >
                  <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-2xl text-white shadow-lg`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>

                  <div className="mt-7 text-sm font-semibold text-blue-400 transition group-hover:translate-x-2">
                    Explore feature →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-400">
              Simple by design
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Three steps. Endless possibilities.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Your journey towards a stronger professional network begins here.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-[#101827]/70 p-8"
              >
                <div className="mb-7 text-5xl font-black text-blue-400/25">
                  {step.number}
                </div>

                <h3 className="text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>

                {index !== 2 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden text-2xl text-blue-400 md:block">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-500/10 p-10 text-center sm:p-16">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            Your community awaits
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black sm:text-5xl">
            Don't just build projects. Build connections.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-slate-400">
            Discover people, share knowledge and take your developer journey
            further.
          </p>

          <Link
            to="/feed"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Start discovering →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ConnectNow. Built for developers.
      </footer>

    </main>
  );
};

export default Home;
