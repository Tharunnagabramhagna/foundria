; (function (global) {
    // Persistent Database using localStorage
    const DB_KEY = "foundira_db_items";

    function getDb() {
        const stored = localStorage.getItem(DB_KEY);
        if (!stored) {
            // Initial seed data for demo
            const seeds = [
                {
                    id: 1,
                    title: "Lost AirPods Pro",
                    description: "White AirPods Pro with charging case. Lost in the study hall during evening hours.",
                    category: "Lost",
                    location: "Study Hall - 2nd Floor",
                    date: new Date().toISOString().split('T')[0],
                    status: "Open",
                    lastSeenTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&w=400",
                    userName: "Demo User",
                    userEmail: "demo@foundira.com"
                },
                {
                    id: 2,
                    title: "Found Water Bottle",
                    description: "Stainless steel water bottle with university sticker. Found near the basketball court.",
                    category: "Found",
                    location: "Basketball Court",
                    date: new Date().toISOString().split('T')[0],
                    status: "Open",
                    lastSeenTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400",
                    userName: "Demo User",
                    userEmail: "demo@foundira.com"
                },
                {
                    id: 3,
                    title: "Lost Textbook",
                    description: "Computer Science textbook 'Introduction to Algorithms'. Has my name written inside the cover.",
                    category: "Lost",
                    location: "Library - 3rd Floor",
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    status: "Open",
                    lastSeenTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400",
                    userName: "Demo User",
                    userEmail: "demo@foundira.com"
                },
                {
                    id: 4,
                    title: "Found Smartphone",
                    description: "Black Samsung Galaxy phone found on bench near the cafeteria.",
                    category: "Found",
                    location: "Central Cafeteria",
                    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0],
                    status: "Open",
                    lastSeenTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400",
                    userName: "Demo User",
                    userEmail: "demo@foundira.com"
                }
            ];
            localStorage.setItem(DB_KEY, JSON.stringify(seeds));
            return seeds;
        }
        return JSON.parse(stored);
    }

    function saveDb(items) {
        localStorage.setItem(DB_KEY, JSON.stringify(items));
    }

    /**
     * Initialize demo items for a specific user
     * Called when user first logs in
     */
    function initializeDemoItems(userEmail, userName) {
        const items = getDb();

        // Check if user already has items
        const userHasItems = items.some(item => item.userEmail === userEmail);
        if (userHasItems) {
            return; // User already has items, don't add demo data
        }

        // Add demo items for this user
        const demoItems = [
            {
                id: Date.now() + 1,
                title: "Lost AirPods Pro",
                description: "White AirPods Pro with charging case. Lost in the study hall during evening hours.",
                category: "Lost",
                location: "Study Hall - 2nd Floor",
                date: new Date().toISOString().split('T')[0],
                status: "Open",
                lastSeenTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&w=400",
                userName: userName,
                userEmail: userEmail
            },
            {
                id: Date.now() + 2,
                title: "Found Water Bottle",
                description: "Stainless steel water bottle with university sticker. Found near the basketball court.",
                category: "Found",
                location: "Basketball Court",
                date: new Date().toISOString().split('T')[0],
                status: "Open",
                lastSeenTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400",
                userName: userName,
                userEmail: userEmail
            },
            {
                id: Date.now() + 3,
                title: "Lost Textbook",
                description: "Computer Science textbook 'Introduction to Algorithms'. Has my name written inside the cover.",
                category: "Lost",
                location: "Library - 3rd Floor",
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
                status: "Open",
                lastSeenTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400",
                userName: userName,
                userEmail: userEmail
            }
        ];

        // Add demo items to database
        items.push(...demoItems);
        saveDb(items);
    }

    // Call Webhooks for external integrations (Make.com)
    async function triggerWebhook(action, data) {
        const webhookUrl = data.category === "Found"
            ? "https://hook.eu1.make.com/ta1zlkts2fowk7jgg5lum0p466clv15j"
            : "https://hook.eu1.make.com/2skly2x41tw73eaf54pkr5p1ijc3h1ai";

        try {
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, action }),
            }).catch(err => console.error("Webhook trigger failed", err));
        } catch (e) { console.error(e); }
    }

    async function getPosts(filter = {}) {
        await new Promise(r => setTimeout(r, 400)); // Simulate net latency
        let items = getDb();

        // Sort by date desc
        items.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filter.category) {
            items = items.filter(i => i.category.toLowerCase() === filter.category.toLowerCase());
        }

        if (filter.search) {
            const q = filter.search.toLowerCase();
            items = items.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q) ||
                i.location.toLowerCase().includes(q)
            );
        }

        return { status: "success", data: items };
    }

    async function createPost(postData) {
        await new Promise(r => setTimeout(r, 600));

        const items = getDb();

        // Get user details from session
        let userName = "Anonymous";
        let userEmail = "anonymous@foundira.com";
        try {
            const storedUser = sessionStorage.getItem("foundira_user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                userName = parsedUser.name || "Anonymous";
                userEmail = parsedUser.email || "anonymous@foundira.com";
            }
        } catch (e) { console.error(e); }

        const newItem = {
            id: Date.now(),
            ...postData,
            date: new Date().toISOString().split('T')[0],
            status: "Open",
            userName: userName,
            userEmail: userEmail,
            image: postData.image || "https://placehold.co/300x200/png?text=No+Image"
        };

        items.unshift(newItem);
        saveDb(items);

        // Notify External Service
        triggerWebhook("create", newItem);

        // Auto-generate notification
        if (window.NotificationApi) {
            window.NotificationApi.createNotification({
                type: 'info',
                title: 'Post Successful',
                message: `Your ${postData.category} item "${postData.title}" has been posted.`,
                link: '/myposts'
            });
        }

        return { status: "success", data: newItem, message: "Post created successfully" };
    }

    async function updatePost(id, updates) {
        await new Promise(r => setTimeout(r, 500));
        const items = getDb();
        const idx = items.findIndex(i => i.id === id);

        if (idx > -1) {
            items[idx] = { ...items[idx], ...updates };
            saveDb(items);

            // Trigger webhook
            triggerWebhook("update", items[idx]);

            return { status: "success", data: items[idx], message: "Post updated successfully" };
        }

        return { status: "error", message: "Post not found" };
    }

    async function deletePost(id) {
        await new Promise(r => setTimeout(r, 400));
        const items = getDb();
        const filtered = items.filter(i => i.id !== id);

        if (filtered.length < items.length) {
            saveDb(filtered);
            return { status: "success", message: "Post deleted successfully" };
        }

        return { status: "error", message: "Post not found" };
    }

    async function getMatches(targetItemId) {
        await new Promise(r => setTimeout(r, 800));

        const items = getDb();
        const targetItem = items.find(i => i.id === targetItemId);

        if (!targetItem) {
            return { status: "error", message: "Item not found" };
        }

        const oppositeCategory = targetItem.category === "Lost" ? "Found" : "Lost";
        const candidates = items.filter(i => i.category === oppositeCategory && i.status === "Open");

        let matches = [];

        if (window.MatchEngine) {
            matches = candidates.map(c => ({
                matchScore: window.MatchEngine.calculateMatch(targetItem, c),
                item: c,
                reason: window.MatchEngine.getMatchReason(targetItem, c)
            })).filter(m => m.matchScore > 30).sort((a, b) => b.matchScore - a.matchScore);

            // Auto-notify for high confidence matches
            if (matches.length > 0) {
                const topMatch = matches[0];
                if (topMatch.matchScore >= 70 && window.NotificationApi) {
                    window.NotificationApi.createNotification({
                        type: 'match',
                        title: 'High Confidence Match!',
                        message: `We found a ${topMatch.matchScore}% match for your "${targetItem.title}".`,
                        link: '/matches'
                    });
                }
            }
        } else {
            matches = candidates.slice(0, 1).map(c => ({
                matchScore: 85,
                item: c,
                reason: "Simulated Match"
            }));
        }

        return {
            status: "success",
            data: matches,
            targetItem: targetItem
        };
    }

    /**
     * Get items created by specific user (for My Items page)
     * @param {string} userEmail - Email of the logged-in user
     * @returns {Promise} - User's items only
     */
    async function getMyItems(userEmail) {
        await new Promise(r => setTimeout(r, 300)); // Simulate latency

        if (!userEmail) {
            return { status: "error", message: "User email required", data: [] };
        }

        let items = getDb();

        // Filter items by userEmail
        const userItems = items.filter(item => item.userEmail === userEmail);

        // Sort by date desc
        userItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        return { status: "success", data: userItems };
    }

    global.ItemsApi = { getPosts, createPost, updatePost, deletePost, getMatches, getMyItems, initializeDemoItems };
})(window);
