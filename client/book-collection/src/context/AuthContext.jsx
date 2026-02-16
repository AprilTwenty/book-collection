import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decoded);
      }
    } catch {
      logout();
    }
  }, [token]);


  useEffect(() => {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    api
      .get(`/userprofile/${user.user_id}`)
      .then(res => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));

  }, [user]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const value = {
    token,
    user,
    profile,
    loading,
    isLogin: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
