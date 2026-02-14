// notificationApi.js

(function (global) {
    const MOCK_NOTIFICATIONS = [
        {
            id: 1,
            type: 'match',
            title: 'Possible match found',
            message: 'A "Black Wallet" matching your description was posted near the Library.',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            link: '/matches'
        },
        {
            id: 2,
            type: 'info',
            title: 'Post Successful',
            message: 'Your lost item "Blue Backpack" has been posted successfully.',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            link: '/myposts'
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'Rahul sent you a message about "Lost Keys".',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
            link: '/chat'
        }
    ];

    async function getNotifications() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                // Return copy to avoid mutation issues in mock
                resolve({
                    status: 'success',
                    data: [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                });
            }, 300);
        });
    }

    async function markAsRead(id) {
        const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
        if (notif) {
            notif.isRead = true;
        }
        return Promise.resolve({ status: 'success' });
    }

    async function markAllAsRead() {
        MOCK_NOTIFICATIONS.forEach(n => n.isRead = true);
        return Promise.resolve({ status: 'success' });
    }

    async function createNotification(notification) {
        const newNotif = {
            id: Date.now(),
            isRead: false,
            createdAt: new Date().toISOString(),
            ...notification
        };
        MOCK_NOTIFICATIONS.unshift(newNotif);
        return Promise.resolve({ status: 'success', data: newNotif });
    }

    global.NotificationApi = {
        getNotifications,
        markAsRead,
        markAllAsRead,
        createNotification
    };

})(window);
