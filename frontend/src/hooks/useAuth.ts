import { useState, useEffect } from "react";
import { API_URL } from "../services/api";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch user");
        })
        .then(userData => {
          setIsAdmin(true); // Assuming existence implies admin for now
          // You might want to store user data in state here if you need it
          // For now, let's update the return to include it dynamically?
          // But useAuth state is local. Let's add a user state.
        })
        .catch(() => {
          // Token invalid
          localStorage.removeItem("token");
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Use a state for user data if needed, or just allow fetching in components
  // For simplicity given the scope, let's just ensure we return valid auth state.
  // But wait, the user wants to see their email. We should expose it.

  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isAdmin) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCurrentUser(data))
        .catch(console.error);
    }
  }, [isAdmin]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.message || "Login failed" } };
      }

      localStorage.setItem("token", data.token);
      setIsAdmin(true);
      return { error: null };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    setCurrentUser(null);
    window.location.href = "/";
  };

  return {
    user: currentUser,
    session: isAdmin ? {} : null,
    isAdmin,
    loading,
    signIn,
    signOut
  };
};
