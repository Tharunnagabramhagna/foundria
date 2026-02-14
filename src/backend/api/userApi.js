; (function (global) {
    // User database key
    const USER_DB_KEY = "foundira_users_db";
    const PROFILE_PHOTOS_KEY = "foundira_profile_photos";

    // Get user database
    function getUserDB() {
        const db = localStorage.getItem(USER_DB_KEY);
        return db ? JSON.parse(db) : {};
    }

    // Save user database
    function saveUserDB(db) {
        localStorage.setItem(USER_DB_KEY, JSON.stringify(db));
    }

    // Get profile photos database
    function getPhotoDB() {
        const db = localStorage.getItem(PROFILE_PHOTOS_KEY);
        return db ? JSON.parse(db) : {};
    }

    // Save profile photos database
    function savePhotoDB(db) {
        localStorage.setItem(PROFILE_PHOTOS_KEY, JSON.stringify(db));
    }

    /**
     * Get user profile by email
     */
    async function getUserProfile(email) {
        // Simulate network latency
        await new Promise(r => setTimeout(r, 300));

        const userDB = getUserDB();
        const photoDB = getPhotoDB();
        const normalizedEmail = email.toLowerCase().trim();

        const user = userDB[normalizedEmail];

        if (!user) {
            return { status: "error", message: "User not found" };
        }

        // Merge with profile photo if exists
        const profilePhoto = photoDB[normalizedEmail];

        return {
            status: "success",
            data: {
                name: user.name,
                email: user.email,
                yearOfStudy: user.yearOfStudy,
                collegeName: user.collegeName,
                gender: user.gender,
                avatar: profilePhoto || user.avatar || "",
                createdAt: user.createdAt,
                stats: {
                    posts: 0, // Will be calculated from items
                    resolved: 0,
                    trustScore: 100
                }
            }
        };
    }

    /**
     * Update user profile
     */
    async function updateProfile(email, updates) {
        await new Promise(r => setTimeout(r, 400));

        const userDB = getUserDB();
        const normalizedEmail = email.toLowerCase().trim();

        if (!userDB[normalizedEmail]) {
            return { status: "error", message: "User not found" };
        }

        // Update user data
        userDB[normalizedEmail] = {
            ...userDB[normalizedEmail],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        saveUserDB(userDB);

        return {
            status: "success",
            data: userDB[normalizedEmail],
            message: "Profile updated successfully"
        };
    }

    /**
     * Upload and save profile photo
     * Converts image to Base64 and stores permanently
     */
    async function uploadProfilePhoto(email, file) {
        return new Promise((resolve, reject) => {
            // Validate file
            if (!file) {
                resolve({ status: "error", message: "No file provided" });
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                resolve({ status: "error", message: "Invalid file type. Please upload JPG, PNG, or WEBP" });
                return;
            }

            // Check file size (2MB limit)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                resolve({ status: "error", message: "File too large. Maximum size is 2MB" });
                return;
            }

            // Convert to Base64
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const base64Image = e.target.result;
                    const normalizedEmail = email.toLowerCase().trim();

                    // Save to profile photos database
                    const photoDB = getPhotoDB();
                    photoDB[normalizedEmail] = base64Image;
                    savePhotoDB(photoDB);

                    // Also update user database
                    const userDB = getUserDB();
                    if (userDB[normalizedEmail]) {
                        userDB[normalizedEmail].avatar = base64Image;
                        userDB[normalizedEmail].updatedAt = new Date().toISOString();
                        saveUserDB(userDB);
                    }

                    // Simulate upload delay
                    await new Promise(r => setTimeout(r, 500));

                    resolve({
                        status: "success",
                        data: { avatarUrl: base64Image },
                        message: "Profile photo updated successfully"
                    });
                } catch (error) {
                    resolve({ status: "error", message: "Failed to process image" });
                }
            };

            reader.onerror = () => {
                resolve({ status: "error", message: "Failed to read file" });
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Generate random avatar using DiceBear API
     */
    async function generateRandomAvatar(email) {
        const seed = email || Date.now();
        const style = "avataaars"; // or 'adventurer', 'bottts', 'personas'
        const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

        // Save to profile photos database
        const normalizedEmail = email.toLowerCase().trim();
        const photoDB = getPhotoDB();
        photoDB[normalizedEmail] = url;
        savePhotoDB(photoDB);

        // Also update user database
        const userDB = getUserDB();
        if (userDB[normalizedEmail]) {
            userDB[normalizedEmail].avatar = url;
            userDB[normalizedEmail].updatedAt = new Date().toISOString();
            saveUserDB(userDB);
        }

        return url;
    }

    /**
     * Get user stats (posts, resolved, trust score)
     */
    async function getUserStats(email) {
        await new Promise(r => setTimeout(r, 200));

        // Calculate from items database
        const items = JSON.parse(localStorage.getItem("foundira_items") || "[]");
        const userItems = items.filter(item => item.userEmail === email);
        const resolved = userItems.filter(item => item.status === "Resolved").length;

        return {
            status: "success",
            data: {
                posts: userItems.length,
                resolved: resolved,
                trustScore: 100 + (resolved * 10) // +10 per resolved item
            }
        };
    }

    global.UserApi = {
        getUserProfile,
        updateProfile,
        uploadProfilePhoto,
        generateRandomAvatar,
        getUserStats
    };
})(window);
