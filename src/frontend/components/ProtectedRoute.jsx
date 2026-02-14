const { Route, Redirect } = ReactRouterDOM;

function ProtectedRoute({ component: Component, ...rest }) {
    const { user, loading } = window.useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <window.AppLogo className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">Checking session...</p>
                </div>
            </div>
        );
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
                )
            }
        />
    );
}

window.ProtectedRoute = ProtectedRoute;
