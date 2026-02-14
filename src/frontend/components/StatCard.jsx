const { useState } = React;

function StatCard({ title, value, color, icon, description, type, onClick }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        if (onClick) onClick(type);
    };

    return (
        <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={handleClick}
            onKeyPress={(e) => e.key === 'Enter' && handleClick()}
            tabIndex={0}
            role="button"
            aria-label={`${title}: ${value}`}
        >
            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
                    {description}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                </div>
            )}

            {/* Card */}
            <div className={`
                bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 border-slate-200 dark:border-white/5
                flex items-center gap-4
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl hover:border-purple-400 dark:hover:border-purple-500
                focus:scale-105 focus:shadow-xl focus:border-purple-400 dark:focus:border-purple-500
                focus:outline-none focus:ring-2 focus:ring-purple-500/50
            `}>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
                </div>
            </div>
        </div>
    );
}

window.StatCard = StatCard;
