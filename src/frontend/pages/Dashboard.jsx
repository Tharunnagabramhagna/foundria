const { Switch, Route, Redirect, useRouteMatch } = ReactRouterDOM;
const { useState, useEffect } = React;

function Dashboard() {
    const { path } = useRouteMatch();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        // Pre-fetch items to ensure data is fresh on dashboard load
        window.ItemsApi.getPosts();
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0b0f1a] transition-colors duration-300 overflow-hidden">
            <window.Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <window.Header
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    onSearch={(q) => {
                        // Dispatch a custom event or use context; for this simple app, we might need a better state strategy
                        // But to keep it simple, we'll store search in sessionStorage or use a PubSub model
                        // For now, let's just log it or pass it if we were lifting state up
                        console.log("Searching for:", q);
                        // Trigger a re-fetch in active components if they listen for it
                        // A simple event bus approach:
                        window.dispatchEvent(new CustomEvent('foundira-search', { detail: q }));
                    }}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        <Switch>
                            <Route exact path={path} component={window.DashboardHome} />
                            <Route path={`${path}/lost`} component={window.Lost} />
                            <Route path={`${path}/found`} component={window.Found} />
                            <Route path={`${path}/myitems`} component={window.MyItems} />
                            <Route path={`${path}/matches`} component={window.Matches} />
                            <Route path={`${path}/chat/:matchId?`} render={(props) => <window.Chat matchId={props.match.params.matchId || "default"} {...props} />} />
                            <Route path={`${path}/profile`} component={window.Profile} />
                            <Redirect to={path} />
                        </Switch>
                    </div>
                </main>
            </div>
        </div>
    );
}

window.Dashboard = Dashboard;
