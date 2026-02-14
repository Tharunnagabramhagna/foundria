const { useState, useEffect } = React;

function MyItems() {
    const { user } = window.useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Lost');
    const [editingItem, setEditingItem] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successType, setSuccessType] = useState('update');
    const [claimingItem, setClaimingItem] = useState(null);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);

        // Fetch all posts without filtering
        const res = await window.ItemsApi.getPosts();

        if (res.status === 'success') {
            setPosts(res.data);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            await window.ItemsApi.deletePost(id);
            setSuccessType('delete');
            setShowSuccess(true);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleClaim = (item) => {
        setClaimingItem(item);
        // Pre-fill subject line
        setEmailSubject(`Found Item Claim: ${item.title}`);
        setEmailMessage(`Hello,\n\nI believe the ${item.title} you found is mine. Here are the details:\n\n[Please describe your item and provide proof of ownership]\n\nThank you!`);
    };

    const handleSendClaimEmail = async (e) => {
        e.preventDefault();

        if (!emailSubject.trim() || !emailMessage.trim()) {
            alert("Please fill in both subject and message");
            return;
        }

        if (!claimingItem.userEmail) {
            alert("❌ Recipient email not found");
            return;
        }

        setSendingEmail(true);

        try {
            // Create email data
            const emailData = {
                to: claimingItem.userEmail,
                subject: emailSubject,
                body: emailMessage
            };

            console.log("=== EMAIL DATA ===");
            console.log("To:", emailData.to);
            console.log("Subject:", emailData.subject);
            console.log("Body:", emailData.body);
            console.log("JSON:", JSON.stringify(emailData));
            console.log("==================");

            // Send to Make.com webhook
            const response = await fetch('https://hook.eu1.make.com/6lqstnsy7z69xvnfgwpm8xx9in0ysf8k', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            console.log("Response status:", response.status);
            const responseText = await response.text();
            console.log("Response body:", responseText);

            if (response.ok) {
                alert("✅ Email sent successfully!");
                setClaimingItem(null);
                setEmailSubject('');
                setEmailMessage('');
            } else {
                alert("❌ Failed to send email. Please try again.");
            }
        } catch (error) {
            console.error("Email send error:", error);
            alert("❌ Network error. Please check your connection and try again.");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            status: formData.get('status')
        };

        if (updates.status === 'Resolved' && editingItem.status !== 'Resolved') {
            setSuccessType('resolve');
        } else {
            setSuccessType('update');
        }

        await window.ItemsApi.updatePost(editingItem.id, updates);
        setEditingItem(null);
        setShowSuccess(true);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        setSuccessType('update');
        loadPosts();
    };

    const filteredPosts = posts.filter(p => p.category === activeTab);

    if (loading) return <div className="p-10 text-center text-slate-500">Loading your items...</div>;

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Items</h1>
                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
                    {posts.length} Items Total
                </span>
            </div>

            {/* Success Animation */}
            {showSuccess && (
                <window.UpdateSuccessAnimation
                    type={successType}
                    onClose={handleSuccessClose}
                />
            )}

            {/* Claim Email Modal */}
            {claimingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setClaimingItem(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Claim Your Item</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Send an email to the person who found: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{claimingItem.title}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSendClaimEmail} className="space-y-4">
                            {/* Item Info */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/5">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={claimingItem.image}
                                        alt={claimingItem.title}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{claimingItem.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{claimingItem.description}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                            📍 {claimingItem.location} • {claimingItem.date}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Subject */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Subject Line
                                </label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter email subject"
                                    required
                                />
                            </div>

                            {/* Email Message */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Describe your item and provide proof of ownership..."
                                    required
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    💡 Tip: Include specific details about your item to prove ownership
                                </p>
                            </div>

                            {/* Sender Info */}
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    📧 Email will be sent from: <span className="font-semibold">{user?.email || "your email"}</span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setClaimingItem(null)}
                                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingEmail ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Email"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => setEditingItem(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Edit Item</h2>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                <input
                                    name="title"
                                    defaultValue={editingItem.title}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingItem.description}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                                <input
                                    name="location"
                                    defaultValue={editingItem.location}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    name="status"
                                    defaultValue={editingItem.status}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('Lost')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'Lost'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    Lost Items
                </button>
                <button
                    onClick={() => setActiveTab('Found')}
                    className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'Found'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    Found Items
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(item => (
                        <div key={item.id} className="relative group">
                            <window.ItemCard
                                item={item}
                                showActions={true}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => handleDelete(item.id)}
                                onClaim={item.category === 'Found' ? () => handleClaim(item) : null}
                                isFoundItem={item.category === 'Found'}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-2">No {activeTab.toLowerCase()} items found.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Go to "Post {activeTab} Item" to report a new item.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

window.MyItems = MyItems;
