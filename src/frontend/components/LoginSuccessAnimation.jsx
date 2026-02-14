const { useEffect, useState } = React;

function LoginSuccessAnimation({ onComplete }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start exit animation after 1.5s
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 1500);

        // Complete the process after total duration (approx 2s)
        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0f1a] transition-opacity duration-500 ease-out ${isExiting ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}
        >
            <style>
                {`
                @keyframes scaleUpLogo {
                    0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
                    50% { transform: scale(1.1); opacity: 1; filter: blur(0); }
                    100% { transform: scale(1); opacity: 1; filter: blur(0); }
                }
                @keyframes glowPulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                    50% { box-shadow: 0 0 50px 10px rgba(99, 102, 241, 0.3); }
                    100% { box-shadow: 0 0 20px 5px rgba(99, 102, 241, 0.1); }
                }
                @keyframes fadeInUpText {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <div className="flex flex-col items-center justify-center relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-150 animate-pulse"></div>

                {/* Logo Container */}
                <div
                    className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl z-10"
                    style={{ animation: 'scaleUpLogo 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, glowPulse 2s infinite' }}
                >
                    <window.AppLogo className="w-24 h-24 text-white drop-shadow-lg" />
                </div>

                {/* Text */}
                <h2
                    className="mt-8 text-2xl md:text-3xl font-bold text-white tracking-wide z-10"
                    style={{ animation: 'fadeInUpText 0.6s ease-out 0.4s forwards', opacity: 0 }}
                >
                    Welcome Back
                </h2>
                <p
                    className="mt-2 text-indigo-300 z-10"
                    style={{ animation: 'fadeInUpText 0.6s ease-out 0.6s forwards', opacity: 0 }}
                >
                    Redirecting to Dashboard...
                </p>
            </div>
        </div>
    );
}

window.LoginSuccessAnimation = LoginSuccessAnimation;
