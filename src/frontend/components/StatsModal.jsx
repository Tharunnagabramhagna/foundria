const { useEffect } = React;

function StatsModal({ type, onClose }) {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getModalContent = () => {
        switch (type) {
            case 'lost':
                return {
                    title: 'Total Lost Items',
                    description: 'Items currently marked as lost by users',
                    items: [
                        { id: 1, name: 'Blue Backpack', category: 'Bags', date: '2 days ago' },
                        { id: 2, name: 'iPhone 13', category: 'Electronics', date: '5 days ago' },
                        { id: 3, name: 'Student ID Card', category: 'Documents', date: '1 week ago' },
                        { id: 4, name: 'Black Wallet', category: 'Accessories', date: '1 week ago' },
                    ],
                    color: 'rose'
                };
            case 'found':
                return {
                    title: 'Total Found Items',
                    description: 'Items reported as found by community members',
                    items: [
                        { id: 1, name: 'Red Umbrella', category: 'Accessories', date: '1 day ago' },
                        { id: 2, name: 'Laptop Charger', category: 'Electronics', date: '3 days ago' },
                        { id: 3, name: 'Library Book', category: 'Books', date: '4 days ago' },
                    ],
                    color: 'emerald'
                };
            case 'resolved':
                return {
                    title: 'Resolved Cases',
                    description: 'Successfully returned items to their owners',
                    items: [
                        { id: 1, name: 'Water Bottle', category: 'Accessories', date: 'Returned 2 days ago' },
                        { id: 2, name: 'Textbook', category: 'Books', date: 'Returned 1 week ago' },
                        { id: 3, name: 'Headphones', category: 'Electronics', date: 'Returned 2 weeks ago' },
                    ],
                    color: 'indigo'
                };
            case 'matches':
                return {
                    title: 'New Matches',
                    description: 'Recent possible matches between lost and found items',
                    items: [
                        { id: 1, name: 'Blue Backpack Match', score: '95%', date: 'Today' },
                        { id: 2, name: 'iPhone Match', score: '87%', date: 'Yesterday' },
                        { id: 3, name: 'Wallet Match', score: '92%', date: '2 days ago' },
                    ],
                    color: 'violet'
                };
            default:
                return { title: 'Details', description: '', items: [], color: 'slate' };
        }
    };

    const content = getModalContent();

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="p-6 text-white"
                    style={{
                        background: content.color === 'rose' ? 'linear-gradient(to right, #f43f5e, #e11d48)' :
                            content.color === 'emerald' ? 'linear-gradient(to right, #10b981, #059669)' :
                                content.color === 'indigo' ? 'linear-gradient(to right, #6366f1, #4f46e5)' :
                                    content.color === 'violet' ? 'linear-gradient(to right, #8b5cf6, #7c3aed)' :
                                        'linear-gradient(to right, #64748b, #475569)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{content.title}</h2>
                            <p className="text-sm opacity-90 mt-1">{content.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6 stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {content.items.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>No items to display</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {content.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 dark:text-white">{item.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {item.category || item.score}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400 dark:text-slate-500">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}

window.StatsModal = StatsModal;
