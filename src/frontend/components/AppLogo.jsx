function AppLogo({ className = "w-16 h-16", color = "" }) {
    // Reverting to image based on user request
    return (
        <img
            src="./public/images/foundira_icon.png"
            alt="Foundira"
            className={`${className} object-contain`}
            onError={(e) => { e.target.style.display = 'none'; }}
        />
    );
}

window.AppLogo = AppLogo;
