; (function (global) {
    const LOCAL_STORAGE_KEY = "foundira_chats";

    function getDb() {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    }

    function saveDb(data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }

    // --- Helper to get user ---
    function getCurrentUser() {
        return JSON.parse(localStorage.getItem("foundira_user"));
    }

    async function getMessages(matchId) {
        await new Promise(r => setTimeout(r, 300));
        const db = getDb();
        return { status: "success", data: db[matchId] || [] };
    }

    async function sendMessage(matchId, content, type = "text") {
        await new Promise(r => setTimeout(r, 200));
        const db = getDb();
        if (!db[matchId]) db[matchId] = [];

        const newMessage = {
            id: Date.now(),
            sender: "me", // In a real app this would be userId
            type, // 'text', 'image', 'system', 'verification', 'handover'
            content,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        db[matchId].push(newMessage);
        saveDb(db);

        // Notify
        if (window.NotificationApi && type !== 'system') {
            // Using a timeout to simulate "received" notification for demo
            // In real app, this notification comes from receiving a message, not sending one
            // So we won't trigger it here for self-sent messages typically
        }

        return { status: "success", data: newMessage };
    }

    async function sendVerificationRequest(matchId, proofData) {
        return sendMessage(matchId, proofData, "verification");
    }

    async function respondToVerification(matchId, decision) { // decision: 'approved' | 'rejected'
        const sysMsg = decision === 'approved'
            ? "Ownership VERIFIED! You can now arrange a handover."
            : "Verification Rejected. Please provide more proof.";

        await sendMessage(matchId, sysMsg, "system");

        // Update match status metadata (mock implementation)
        const db = getDb();
        if (!db[matchId + "_meta"]) db[matchId + "_meta"] = {};
        db[matchId + "_meta"].isVerified = (decision === 'approved');
        saveDb(db);

        return { status: "success", decision };
    }

    async function getChatMetadata(matchId) {
        const db = getDb();
        return { status: "success", data: db[matchId + "_meta"] || { isVerified: false, handover: null } };
    }

    async function proposeHandover(matchId, details) {
        const db = getDb();
        if (!db[matchId + "_meta"]) db[matchId + "_meta"] = {};
        db[matchId + "_meta"].handover = details;
        saveDb(db);

        await sendMessage(matchId, details, "handover");
        return { status: "success" };
    }

    global.ChatApi = {
        getMessages,
        sendMessage,
        sendVerificationRequest,
        respondToVerification,
        getChatMetadata,
        proposeHandover
    };
})(window);
