; (function (global) {
  const LOGIN_WEBHOOK = "https://hook.eu1.make.com/yqhr3wl5doooqldn90bwb013glq40y2f";
  const SIGNUP_WEBHOOK = "https://hook.eu1.make.com/p0auu2abz4fdh6yvtyrs9fky6nrgizsg";

  // Simple Base64 encoding for password storage (hackathon-safe)
  function encodePassword(password) {
    return btoa(password);
  }

  function verifyPassword(entered, stored) {
    return btoa(entered) === stored;
  }

  // Local user database (for demo purposes)
  function getUserDB() {
    const db = localStorage.getItem("foundira_users_db");
    return db ? JSON.parse(db) : {};
  }

  function saveUserDB(db) {
    localStorage.setItem("foundira_users_db", JSON.stringify(db));
  }

  async function postAuth(url, payload) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        /* ignore json parse errors */
      }
      if (!res.ok) {
        return {
          status: "error",
          message: (data && data.message) || `Request failed (${res.status})`,
        };
      }

      // If we got a valid JSON response with status, return it
      if (data && typeof data.status === "string") {
        return data;
      }

      // ❌ REMOVED INSECURE FALLBACK - No automatic success
      return { status: "error", message: "Invalid response from server" };
    } catch (err) {
      // Network error - fall back to local authentication
      return null; // Signal to use local auth
    }
  }

  async function registerUser(detailsOrEmail, password) {
    let payload;
    if (
      typeof detailsOrEmail === "object" &&
      detailsOrEmail !== null &&
      !Array.isArray(detailsOrEmail)
    ) {
      const {
        name,
        email,
        password: pwd,
        yearOfStudy,
        collegeName,
        gender,
      } = detailsOrEmail;
      payload = {
        action: "signup",
        name,
        email,
        password: pwd ?? password,
        yearOfStudy,
        collegeName,
        gender,
      };
    } else {
      payload = { action: "signup", email: detailsOrEmail, password };
    }

    // Try webhook first
    const result = await postAuth(SIGNUP_WEBHOOK, payload);

    // If webhook fails, use local storage
    if (!result || result.status === "error") {
      const db = getUserDB();
      const email = payload.email.toLowerCase().trim();

      if (db[email]) {
        return { status: "error", message: "Email already registered" };
      }

      // Store user with encoded password
      db[email] = {
        name: payload.name || "User",
        email: email,
        password: encodePassword(payload.password),
        yearOfStudy: payload.yearOfStudy || "1st",
        collegeName: payload.collegeName || "Foundira University",
        gender: payload.gender || "Not Specified",
        createdAt: new Date().toISOString()
      };

      saveUserDB(db);
      return {
        status: "success",
        message: "Account created successfully",
        data: { ...db[email], password: undefined } // Don't return password
      };
    }

    return result;
  }

  async function loginUser(email, password) {
    // Validate inputs
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { status: "error", message: "Email and password are required" };
    }

    // Try webhook first
    const result = await postAuth(LOGIN_WEBHOOK, {
      action: "login",
      email: trimmedEmail,
      password: trimmedPassword
    });

    // If webhook succeeds with proper verification, use it
    if (result && result.status === "success") {
      return result;
    }

    // Fall back to local authentication
    const db = getUserDB();
    const user = db[trimmedEmail];

    // User not found
    if (!user) {
      return {
        status: "error",
        message: "Invalid email or password" // Don't reveal which is wrong
      };
    }

    // Verify password
    if (!verifyPassword(trimmedPassword, user.password)) {
      return {
        status: "error",
        message: "Invalid email or password"
      };
    }

    // Success - return user data without password
    return {
      status: "success",
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
        yearOfStudy: user.yearOfStudy,
        collegeName: user.collegeName,
        gender: user.gender
      }
    };
  }

  global.AuthApi = { registerUser, loginUser };
})(window);
