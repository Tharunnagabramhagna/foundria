const { useState, useEffect } = React;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [entryAnimation, setEntryAnimation] = useState(false);

  useEffect(() => {
    // Trigger entry animation on mount
    setEntryAnimation(true);
    const msg = localStorage.getItem("foundira_flash");
    if (msg) {
      setFlash(msg);
      localStorage.removeItem("foundira_flash");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await window.AuthApi.loginUser(email.trim(), password);
      if (res.status === "success") {
        // Store response data temporarily for the onComplete callback
        window.tempAuthRes = res.data || res;
        setShowAnimation(true);
      } else {
        setError(res.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showAnimation && <window.LoginSuccessAnimation onComplete={() => onSuccess(window.tempAuthRes)} />}
      <style>
        {`
          @keyframes fadeInUpCard {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInInput {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
      <form onSubmit={handleSubmit} className={`space-y-3 transition-colors duration-300 ${entryAnimation ? 'animate-fade-in' : 'opacity-0'}`} noValidate>
        {flash && (
          <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-lg px-3 py-2 animate-fade-in">
            {flash}
          </div>
        )}
        <div style={{ opacity: 0, animation: 'fadeInInput 0.6s ease-out 0.2s forwards' }}>
          <label className="sr-only" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div style={{ opacity: 0, animation: 'fadeInInput 0.6s ease-out 0.3s forwards' }}>
          <label className="sr-only" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            minLength={6}
            required
          />
        </div>
        {error && (
          <div className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/30 rounded-lg px-3 py-2 animate-pulse">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ opacity: 0, animation: 'fadeInUpCard 0.6s ease-out 0.4s forwards' }}
          className={
            "w-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold py-3 shadow-lg shadow-indigo-900/40 transition-transform active:scale-95 " +
            (loading ? "opacity-70 cursor-not-allowed" : "hover:from-indigo-400 hover:to-violet-400")
          }
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-slate-400 text-sm" style={{ opacity: 0, animation: 'fadeInUpCard 0.6s ease-out 0.5s forwards' }}>
          Don’t have an account?{" "}
          <a href="#/signup" className="text-indigo-300 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </>
  );
}

window.Login = Login;
