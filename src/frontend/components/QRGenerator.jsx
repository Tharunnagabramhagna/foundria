const { useState, useEffect } = React;

function QRGenerator() {
    const { user } = window.useAuth();
    const [qrUrl, setQrUrl] = useState("");

    // Using a simpler QR API for demo since we don't have a library
    const generateQR = () => {
        const data = `foundira:user:${user?.email || 'guest'}`;
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`);
    };

    useEffect(() => {
        if (user) generateQR();
    }, [user]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/5 text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Your Foundira QR</h3>
            <p className="text-sm text-slate-500 mb-6">Print this code and stick it on your valuables. If lost, finders can scan it to contact you.</p>

            <div className="flex justify-center mb-6">
                {qrUrl ? (
                    <div className="p-3 bg-white rounded-xl shadow-inner">
                        <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                    </div>
                ) : (
                    <div className="w-48 h-48 bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
                )}
            </div>

            <button
                onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = 'Foundira_QR.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
                Download QR
            </button>
        </div>
    );
}

window.QRGenerator = QRGenerator;
