const { useState, useEffect } = React;

function Matches() {
    const [matches, setMatches] = useState([]);
    const [targetItem, setTargetItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
        if (score >= 50) return "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
        return "text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    };

    const loadMatches = () => {
        window.ItemsApi.getMatches().then(res => {
            if (res.status === 'success') {
                setMatches(res.data);
                setTargetItem(res.targetItem);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        loadMatches();
        const interval = setInterval(loadMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-500">Scanning for matches...</div>;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10 w-full md:w-2/3">
                    <h1 className="text-3xl font-bold mb-4">Smart Matches</h1>
                    <p className="text-indigo-100 text-lg opacity-90">
                        Our AI analysis compares descriptions, locations, and timestamps to find potential matches for your lost items.
                    </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 transform translate-x-1/2 blur-3xl"></div>
            </div>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <span className="bg-indigo-600 text-white p-2 rounded-xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </span>
                            Smart Matches
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Real-time AI suggestions for your lost item:
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 ml-1">
                                {targetItem ? targetItem.title : "Checking recent posts..."}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => { setLoading(true); loadMatches(); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                </div>

                {matches.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No matches found yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            We couldn't find any items matching your description right now.
                            Our system will keep searching automatically.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {matches.map((match, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 animate-slide-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="w-full md:w-48 h-48 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative group">
                                    <img
                                        src={match.item.image}
                                        alt={match.item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                                                {match.item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {match.item.location}
                                            </div>
                                        </div>

                                        <div className={`px-4 py-2 rounded-xl border ${getScoreColor(match.matchScore)} flex flex-col items-center min-w-[100px]`}>
                                            <span className="text-2xl font-black">{match.matchScore}%</span>
                                            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Match</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                                        {match.item.description}
                                    </p>

                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-white/5 mb-4">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Why matched?</span>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {match.reason}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        {match.item.lastSeenTime && (
                                            <div className="text-xs text-slate-500">
                                                Found: {new Date(match.item.lastSeenTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                            </div>
                                        )}
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                            Contact Finder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

window.Matches = Matches;
