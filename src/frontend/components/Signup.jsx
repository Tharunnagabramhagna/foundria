const { useState } = React;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Signup({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!yearOfStudy) {
      setError("Select your year of study.");
      return;
    }
    if (!collegeName.trim()) {
      setError("Enter your college name.");
      return;
    }
    if (!gender) {
      setError("Select your gender.");
      return;
    }
    setLoading(true);
    try {
      const res = await window.AuthApi.registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        yearOfStudy,
        collegeName: collegeName.trim(),
        gender,
      });
      if (res.status === "success") {
        localStorage.setItem("foundira_flash", "Account created successfully");
        setPassword("");
        setConfirm("");
        window.location.hash = "#/login";
      } else {
        setError(res.message || "Could not create account");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 transition-colors duration-300" noValidate>
      <div>
        <label className="sr-only" htmlFor="signup-name">
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="signup-password">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="sr-only" htmlFor="signup-year">
            Year of study
          </label>
          <select
            id="signup-year"
            className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:border-white/10 dark:focus:border-indigo-400"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
            required
          >
            <option value="">Year of study</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="signup-gender">
            Gender
          </label>
          <select
            id="signup-gender"
            className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:border-white/10 dark:focus:border-indigo-400"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div>
        <label className="sr-only" htmlFor="signup-college">
          College name
        </label>
        <input
          id="signup-college"
          type="text"
          className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
          placeholder="College name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          autoComplete="organization"
          required
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="signup-confirm">
          Confirm password
        </label>
        <input
          id="signup-confirm"
          type="password"
          className="w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors duration-300 bg-white/90 text-slate-900 placeholder-slate-500 border-slate-300 focus:border-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-400 dark:border-white/10 dark:focus:border-indigo-400"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      {error && (
        <div className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className={
          "w-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold py-3 shadow-lg shadow-indigo-900/40 transition " +
          (loading ? "opacity-70 cursor-not-allowed" : "hover:from-indigo-400 hover:to-violet-400")
        }
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-slate-400 text-sm">
        Already have an account?{" "}
        <a href="#/login" className="text-indigo-300 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}

window.Signup = Signup;
