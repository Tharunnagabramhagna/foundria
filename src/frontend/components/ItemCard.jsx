function ItemCard({ item, showActions = false, onEdit, onDelete, onClaim, isFoundItem = false }) {
    const isLost = item.category === "Lost";

    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col h-full">
            <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${isLost
                        ? "bg-rose-500/90 text-white"
                        : "bg-emerald-500/90 text-white"
                        }`}>
                        {item.category}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-sm border ${item.status === "Resolved"
                        ? "bg-slate-800/80 text-white border-slate-700"
                        : "bg-white/80 dark:bg-black/50 text-slate-700 dark:text-slate-200"
                        }`}>
                        {item.status}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                        {item.title}
                    </h3>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                    {item.description}
                </p>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{item.date}</span>
                    </div>
                </div>

                {item.lastSeenTime && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            {item.category === 'Lost' ? 'Last Seen: ' : 'Found: '}
                            {new Date(item.lastSeenTime).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>
                )}


                {showActions && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2">
                        {isFoundItem ? (
                            <button
                                onClick={() => onClaim(item)}
                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                It's Me
                            </button>
                        ) : (
                            <button onClick={() => onEdit(item)} className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                Edit
                            </button>
                        )}
                        <button onClick={() => onDelete(item.id)} className="flex-1 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

window.ItemCard = ItemCard;
