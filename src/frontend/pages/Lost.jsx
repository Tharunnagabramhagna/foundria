const { useHistory } = ReactRouterDOM;

function Lost() {
    const history = useHistory();

    const handlePost = async (data) => {
        const res = await window.ItemsApi.createPost(data);
        if (res.status === 'success') {
            // Show success message (could be a toast)
            history.push('/dashboard/myposts');
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Report a Lost Item</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Provide as much detail as possible to help us find your item.
                    Our smart matching system will alert you if a similar item is found.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/5">
                <window.PostForm type="Lost" onSubmit={handlePost} />
            </div>
        </div>
    );
}

window.Lost = Lost;
