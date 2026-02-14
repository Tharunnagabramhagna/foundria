function Profile() {
    const { user, updateProfile } = window.useAuth();
    const { useState, useEffect, useRef } = React;
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [message, setMessage] = useState("");
    const [stats, setStats] = useState({ posts: 0, resolved: 0, trustScore: 100 });
    const fileInputRef = useRef(null);

    // Load user stats on mount
    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        if (window.UserApi && user?.email) {
            const res = await window.UserApi.getUserStats(user.email);
            if (res.status === "success") {
                setStats(res.data);
            }
        }
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        setMessage("");

        try {
            const res = await window.UserApi.uploadProfilePhoto(user.email, file);

            if (res.status === "success") {
                // Update AuthContext with new avatar
                updateProfile({ avatar: res.data.avatarUrl });
                setMessage("✅ Profile photo updated successfully!");

                // Clear message after 3 seconds
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("❌ " + (res.message || "Failed to upload photo"));
            }
        } catch (error) {
            setMessage("❌ Error uploading photo");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleAvatarGenerate = async () => {
        setLoading(true);
        setMessage("");

        try {
            const url = await window.UserApi.generateRandomAvatar(user.email);
            // Update user context
            updateProfile({ avatar: url });
            setMessage("✅ Avatar generated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("❌ Failed to generate avatar");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setMessage("❌ Name cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const res = await window.UserApi.updateProfile(user.email, { name: name.trim() });
            if (res.status === "success") {
                updateProfile({ name: name.trim() });
                setIsEditing(false);
                setMessage("✅ Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("❌ " + (res.message || "Failed to update profile"));
            }
        } catch (error) {
            setMessage("❌ Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
            {/* Success/Error Message */}
            {message && (
                <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${message.startsWith('✅')
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                    {message}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 mt-12 mb-6 px-4">
                    {/* Profile Photo with Upload */}
                    <div className="relative">
                        <div className="group relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-xl">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&size=200&t=${Date.now()}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs text-center p-2 gap-1">
                                <button
                                    onClick={triggerFileInput}
                                    disabled={uploadingPhoto}
                                    className="w-full py-1 px-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
                                >
                                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                                </button>
                                <button
                                    onClick={handleAvatarGenerate}
                                    disabled={loading || uploadingPhoto}
                                    className="w-full py-1 px-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
                                >
                                    {loading ? "Generating..." : "Random Avatar"}
                                </button>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />

                        {/* Upload Instructions */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                            Hover to change photo
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 mb-2">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    className="text-2xl font-bold bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 outline-none text-slate-800 dark:text-white"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="text-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">{user?.name}</h1>
                        )}
                        <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mt-1">
                            {user?.collegeName} • {user?.yearOfStudy} Year • {user?.gender}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-5 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-lg font-medium text-slate-700 dark:text-slate-300 transition-colors mb-2"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 px-4 py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.posts}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Posts</div>
                    </div>
                    <div className="text-center border-x border-slate-200 dark:border-white/10">
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Resolved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.trustScore}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Trust Score</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Account Settings</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                <span className="text-slate-600 dark:text-slate-300">Change Password</span>
                                <span className="text-indigo-500 cursor-pointer text-sm">Update</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                <span className="text-slate-600 dark:text-slate-300">Notification Preferences</span>
                                <span className="text-indigo-500 cursor-pointer text-sm">Manage</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">QR Code</h3>
                        <window.QRGenerator userId={user?.email} />
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Profile = Profile;
