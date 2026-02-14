const { HashRouter, Switch, Route, Redirect, useHistory } = ReactRouterDOM;

function LoginRoute() {
  const history = useHistory();
  const { login, user } = window.useAuth();

  // Polyfill if needed by existing auth page code
  window.ReactRouterDOMNavigate = (path, opts) =>
    opts && opts.replace ? history.replace(path) : history.push(path);

  const handleSuccess = (res) => {
    // Construct user object from response or default
    const userData = {
      name: res.name || "User",
      email: res.email || "user@example.com",
      collegeName: res.collegeName || "Foundira University",
      yearOfStudy: res.yearOfStudy || "1st",
      gender: res.gender || "Not Specified"
    };
    login(userData);
    history.push("/dashboard");
  };

  if (user) return <Redirect to="/dashboard" />;

  return <window.AuthPage mode="login" onSuccess={handleSuccess} />;
}

function SignupRoute() {
  const history = useHistory();
  const { user } = window.useAuth();

  window.ReactRouterDOMNavigate = (path, opts) =>
    opts && opts.replace ? history.replace(path) : history.push(path);

  if (user) return <Redirect to="/dashboard" />;

  return <window.AuthPage mode="signup" onSuccess={() => { }} />;
}

function SplashRoute() {
  return <window.SplashScreen />;
}

function IntroAnimationRoute() {
  const history = useHistory();

  // Per request: Always show animation on entry
  const handleComplete = () => {
    history.replace('/splash');
  };

  return <window.IntroAnimation onComplete={handleComplete} />;
}

const AppContainer = () => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure all Babel-transpiled scripts are ready
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <window.ThemeProvider>
      <window.AuthProvider>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={IntroAnimationRoute} />
            <Route exact path="/splash" component={SplashRoute} />
            <Route exact path="/login" component={LoginRoute} />
            <Route exact path="/signup" component={SignupRoute} />

            {/* Protected Dashboard Routes */}
            <window.ProtectedRoute path="/dashboard" component={window.Dashboard} />

            <Redirect to="/" />
          </Switch>
        </HashRouter>
      </window.AuthProvider>
    </window.ThemeProvider>
  );
}

const initializeApp = () => {
  const container = document.getElementById("app");
  if (container) {
    // Use window.ReactDOM to ensure it's picked up from the CDN script
    const dom = window.ReactDOM || ReactDOM;
    if (dom && dom.createRoot) {
      const root = dom.createRoot(container);
      root.render(<AppContainer />);
    } else {
      console.error("ReactDOM not found! Make sure React scripts are loaded.");
    }
  }
};

// Start initialization
if (document.readyState === 'complete') {
  initializeApp();
} else {
  window.addEventListener('load', initializeApp);
}
