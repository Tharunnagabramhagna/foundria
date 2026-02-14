const { createContext, useContext, useState, useEffect } = React;

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    // Check sessionStorage for existing session
    const storedAuth = sessionStorage.getItem("foundira_auth");
    const storedUser = sessionStorage.getItem("foundira_user");

    if (storedAuth === "true" && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Fetch latest profile data including avatar from database
        if (window.UserApi && parsedUser.email) {
          const profileRes = await window.UserApi.getUserProfile(parsedUser.email);
          if (profileRes.status === "success") {
            // Merge session data with latest profile data
            const mergedUser = { ...parsedUser, ...profileRes.data };
            setUser(mergedUser);
            // Update session storage with latest data
            sessionStorage.setItem("foundira_user", JSON.stringify(mergedUser));
          } else {
            setUser(parsedUser);
          }
        } else {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
        logout(); // Clear invalid session
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = (userData) => {
    sessionStorage.setItem("foundira_auth", "true");
    sessionStorage.setItem("foundira_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("foundira_auth");
    sessionStorage.removeItem("foundira_user");
    sessionStorage.removeItem("foundira_msg");
    setUser(null);
    // Determine redirect based on router context if available, or force reload
    window.location.hash = "#/login";
  };

  const updateProfile = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    sessionStorage.setItem("foundira_user", JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

window.AuthProvider = AuthProvider;
window.useAuth = useAuth;
