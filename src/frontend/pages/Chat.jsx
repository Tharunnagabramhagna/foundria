const { useState, useEffect, useRef } = React;

function Chat({ matchId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("pending");
    const [isVerified, setIsVerified] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        loadChat();
        const poller = setInterval(loadChat, 3000);
        return () => clearInterval(poller);
    }, [matchId]);

    const loadChat = async () => {
        const msgs = await window.ChatApi.getMessages(matchId);
        setMessages(msgs.data);

        // Fetch verification/handover status
        const meta = await window.ChatApi.getChatMetadata(matchId);
        if (meta.data.isVerified) {
            setIsVerified(true);
            setVerificationStatus("verified");
        }

        scrollToBottom();
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await window.ChatApi.sendMessage(matchId, newMessage);
        setNewMessage("");
        loadChat();
    };

    const handleVerification = async () => {
        if (confirm("Send verification proof?")) {
            await window.ChatApi.sendVerificationRequest(matchId, "Proof Image: [Attached]");
            loadChat();
        }
    };

    const handleHandover = async () => {
        const details = prompt("Enter meetup details (Location, Time):");
        if (details) {
            await window.ChatApi.proposeHandover(matchId, details);
            loadChat();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-4">
                    <window.AppLogo className="w-10 h-10 text-indigo-500" />
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Match Chat</h2>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-slate-500 dark:text-slate-400 capitalize">
                                {isVerified ? 'Verified Owner' : 'Pending Verification'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isVerified && (
                        <button
                            onClick={handleVerification}
                            className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 transition-colors"
                        >
                            Verify Item
                        </button>
                    )}
                    {isVerified && (
                        <button
                            onClick={handleHandover}
                            className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 transition-colors"
                        >
                            Arrange Handover
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        Start the conversation to reconnect!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-white/5 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-800 dark:text-white"
                />
                <button
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

function ChatMessage({ msg }) {
    const isMe = msg.sender === 'me';

    // System Message Check
    if (msg.type === 'system') {
        return (
            <div className="flex justify-center my-2">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-1 px-3 rounded-full border border-slate-200 dark:border-slate-700">
                    {msg.content}
                </span>
            </div>
        );
    }

    if (msg.type === 'verification') {
        return (
            <div className={`p-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 w-fit max-w-[80%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verification Request
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{msg.content}</p>
                {/** Only the RECEIVER (finder) should see action buttons, simulating for demo **/}
                {!isMe && (
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => window.ChatApi.respondToVerification(1, 'approved')} // 1=matchId mock
                            className="px-3 py-1 bg-emerald-500 text-white text-xs rounded shadow-sm hover:bg-emerald-600"
                        >
                            Approve
                        </button>
                        <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded hover:bg-slate-300">
                            Reject
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (msg.type === 'handover') {
        return (
            <div className="flex justify-center my-4 w-full">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 max-w-sm text-center shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">Handover Proposal</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-3">{msg.content}</p>
                    <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                        Confirm Meeting
                    </button>
                </div>
            </div>
        );
    }

    // Default Text Message
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}
            >
                {msg.content}
                <div className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

window.Chat = Chat;
