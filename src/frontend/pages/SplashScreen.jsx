function SplashScreen() {
  const { useEffect } = React;

  useEffect(() => {
    const t = setTimeout(() => {
      // Navigate to dashboard if logged in
      const isAuth = sessionStorage.getItem("foundira_auth");
      const target = isAuth ? "/dashboard" : "/login";

      if (window.ReactRouterDOMNavigate) {
        window.ReactRouterDOMNavigate(target, { replace: true });
      } else {
        window.location.hash = "#" + target;
      }
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Dynamic Abstract Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container with Scan Effect */}
        <div className="relative w-48 h-48 flex items-center justify-center">

          {/* Outer spin rings */}
          <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border-2 border-dashed border-violet-500/20 rounded-full animate-[spin_8s_linear_infinite_reverse]" />

          {/* SVG Logo */}
          <div className="relative z-10 text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-bounce custom-bounce">
            {/* Replaced dynamic SVG with AppLogo image as requested */}
            <window.AppLogo className="w-24 h-24 drop-shadow-lg" />
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">
            Foundira
          </h2>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <style>{`
            .custom-bounce { animation: bounce 2s infinite; }
            @keyframes bounce {
              0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
              50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
            }
        `}</style>
    </div>
  );
}

window.SplashScreen = SplashScreen;
