function UpdateSuccessAnimation({ type = "update", onClose }) {
    const { useEffect } = React;

    useEffect(() => {
        // Auto-close after 1.5 seconds
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    let message = "Item Updated Successfully!";
    let subtext = "Your changes have been saved.";
    let iconPath = "M5 13l4 4L19 7"; // Checkmark
    let colorClass = "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20";

    if (type === "delete") {
        message = "Item Deleted Successfully";
        subtext = "The item has been removed.";
        iconPath = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
        colorClass = "text-rose-500 bg-rose-100 dark:bg-rose-500/20";
    } else if (type === "resolve") {
        message = "Item Marked as Resolved!";
        subtext = "Great job finding the owner!";
        iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
        colorClass = "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20";
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" role="alert" aria-live="assertive">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col items-center transform transition-all animate-bounce-in max-w-sm w-full mx-4 border border-slate-100 dark:border-white/10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${colorClass} animate-pulse-slow`}>
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center animate-slide-up-fade">
                    {message}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-center animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                    {subtext}
                </p>
            </div>
            <style>{`
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.8); }
                    50% { transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-bounce-in {
                    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up-fade {
                    animation: slideUpFade 0.4s ease-out forwards;
                }
                .animate-pulse-slow {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}

window.UpdateSuccessAnimation = UpdateSuccessAnimation;
