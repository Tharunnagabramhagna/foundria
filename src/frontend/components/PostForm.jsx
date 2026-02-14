const { useState } = React;

function PostForm({ type = "Lost", onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        category: type,
        description: "",
        location: "",
        lastSeenTime: "",
        email: "",

        date: new Date().toISOString().split('T')[0],
        image: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
                    <input
                        name="title"
                        required
                        className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder={`e.g. ${type === 'Lost' ? 'Blue Nike Backpack' : 'Found Car Keys'}`}
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                    <input
                        name="location"
                        required
                        className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Central Library"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <window.DateTimePicker
                        label={type === 'Lost' ? 'Last Seen Time' : 'Time Found'}
                        required={type === 'Lost'}
                        value={formData.lastSeenTime}
                        onChange={(val) => setFormData(prev => ({ ...prev, lastSeenTime: val }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                    name="description"
                    required
                    rows="4"
                    className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="Describe the item in detail..."
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image URL (Optional)</label>
                <input
                    name="image"
                    type="url"
                    className="w-full rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-[1.01] ${type === 'Lost'
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                    } ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
                {loading ? "Submitting..." : `Post ${type} Item`}
            </button>
        </form >
    );
}

window.PostForm = PostForm;
