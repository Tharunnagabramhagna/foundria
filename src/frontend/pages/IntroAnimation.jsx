function IntroAnimation({ onComplete }) {
    const { useEffect, useState } = React;
    const { useHistory } = ReactRouterDOM;
    const history = useHistory();

    const [stage, setStage] = useState(0);

    // Generate random particles
    const particles = [...Array(40)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 3,
        duration: Math.random() * 4 + 4,
        color: ['rgba(139, 92, 246, 0.4)', 'rgba(99, 102, 241, 0.4)', 'rgba(255, 255, 255, 0.2)'][Math.floor(Math.random() * 3)]
    }));

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const t1 = setTimeout(() => setStage(1), 500);
        const t2 = setTimeout(() => setStage(2), 1500);
        const t3 = setTimeout(() => {
            setStage(3);
            if (onComplete) {
                onComplete();
            } else {
                if (window.location.hash) {
                    window.location.hash = "#/login";
                } else {
                    history.replace('/login');
                }
            }
        }, 3500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            document.body.style.overflow = 'auto';
        };
    }, [history, onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden transition-colors duration-1000 ${stage >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <style>
                {`
                @keyframes floatParticle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .logo-spin {
                    animation: spinLogo 20s linear infinite;
                }
                @keyframes spinLogo {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>

            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950 transition-opacity duration-1000 ${stage >= 2 ? 'opacity-100' : 'opacity-90'}`} />

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full animate-[floatParticle_6s_linear_infinite]"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Animated Logo Container using SVG */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div
                    className={`relative w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-all duration-1000 transform 
                        ${stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                        ${stage === 2 ? 'shadow-[0_0_60px_rgba(139,92,246,0.6)] border-violet-400/50 rotate-12' : 'shadow-none'}
                    `}
                >
                    {/* Replaced static image with dynamic SVG */}
                    {/* Replaced dynamic SVG with AppLogo image as requested */}
                    <window.AppLogo className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg" />

                    {/* Inner glowing ring */}
                    <div className={`absolute inset-0 rounded-full border border-violet-400/30 transition-all duration-1000 ${stage === 2 ? 'scale-125 opacity-100 animate-ping' : 'scale-100 opacity-0'}`} />
                </div>

                {/* Text Reveal */}
                <div className={`mt-8 text-center transition-all duration-700 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-violet-200 to-fuchsia-200 drop-shadow-sm">
                        Foundira
                    </h1>
                    <p className={`text-indigo-300 text-sm md:text-lg tracking-[0.2em] uppercase transition-opacity duration-700 delay-300 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        Initializing Smart Connect...
                    </p>
                </div>
            </div>
        </div>
    );
}

window.IntroAnimation = IntroAnimation;
