const { useState, useEffect } = React;

function DashboardHome() {
    const [stats, setStats] = useState({ lost: 0, found: 0, resolved: 0, matches: 0 });
    const [recent, setRecent] = useState([]);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        // Fetch real stats from API
        fetchStats();
        fetchItems();

        const handleSearch = (e) => {
            fetchItems(e.detail);
        };
        window.addEventListener('foundira-search', handleSearch);
        return () => window.removeEventListener('foundira-search', handleSearch);
    }, []);

    function fetchStats() {
        // In a real app, this would call ItemsApi.getStats()
        // For now, using mock data
        window.ItemsApi.getPosts().then(res => {
            if (res.status === 'success') {
                const items = res.data;
                const lost = items.filter(i => i.type === 'Lost' && i.status !== 'Resolved').length;
                const found = items.filter(i => i.type === 'Found' && i.status !== 'Resolved').length;
                const resolved = items.filter(i => i.status === 'Resolved').length;
                const matches = Math.floor(Math.random() * 10); // Mock matches

                setStats({ lost, found, resolved, matches });
            }
        });
    }

    function fetchItems(search = "") {
        window.ItemsApi.getPosts({ search }).then(res => {
            if (res.status === 'success') setRecent(res.data.slice(0, 3));
        });
    }

    const handleCardClick = (type) => {
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <window.StatCard
                    title="Total Lost"
                    value={stats.lost}
                    color="bg-rose-500 text-rose-500"
                    description="Items currently marked as lost by users"
                    type="lost"
                    onClick={handleCardClick}
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
                <window.StatCard
                    title="Total Found"
                    value={stats.found}
                    color="bg-emerald-500 text-emerald-500"
                    description="Items reported as found by community"
                    type="found"
                    onClick={handleCardClick}
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <window.StatCard
                    title="Resolved"
                    value={stats.resolved}
                    color="bg-indigo-500 text-indigo-500"
                    description="Successfully returned items"
                    type="resolved"
                    onClick={handleCardClick}
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <window.StatCard
                    title="New Matches"
                    value={stats.matches}
                    color="bg-violet-500 text-violet-500"
                    description="Recent possible matches found"
                    type="matches"
                    onClick={handleCardClick}
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />
            </div>

            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recent.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            <p>No recent activity</p>
                        </div>
                    ) : (
                        recent.map(item => <window.ItemCard key={item.id} item={item} />)
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalType && <window.StatsModal type={modalType} onClose={closeModal} />}
        </div>
    );
}

window.DashboardHome = DashboardHome;
