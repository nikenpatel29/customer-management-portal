import { createContext, useContext, useEffect, useState } from "react";
import { login as performLogin } from "../../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const setCustomerFromToken = () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return logOut();

      const decoded = jwtDecode(token);

      // Check if token expired
      if (Date.now() >= decoded.exp * 1000) {
        logOut();
        return;
      }

      const storedProfile = JSON.parse(localStorage.getItem("customer_profile") || "{}");

      setCustomer({
        username: decoded.sub,
        roles: decoded.scopes,
        firstName: storedProfile.firstName || "",
        lastName: storedProfile.lastName || "",
        profilePicture:
          storedProfile.profilePicture ||
          "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
      });
    } catch (err) {
      console.error("Error decoding token:", err);
      logOut();
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameAndPassword) => {
    try {
      const res = await performLogin(usernameAndPassword);

      // Get token from headers (normalize)
      const jwtHeader = res.headers["authorization"] || res.headers["Authorization"];
      if (!jwtHeader) throw new Error("No authorization token received");

      const token = jwtHeader.startsWith("Bearer ") ? jwtHeader.slice(7) : jwtHeader;
      localStorage.setItem("access_token", token);

      // Initialize customer state
      const decoded = jwtDecode(token);
      const storedProfile = JSON.parse(localStorage.getItem("customer_profile") || "{}");

      setCustomer({
        username: decoded.sub,
        roles: decoded.scopes,
        firstName: storedProfile.firstName || "",
        lastName: storedProfile.lastName || "",
        profilePicture:
          storedProfile.profilePicture ||
          "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9",
      });

      return res;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("customer_profile");
    setCustomer(null);
  };

  const updateCustomerProfile = (updatedData) => {
    setCustomer((prev) => {
      if (!prev) return null;

      const newCustomer = { ...prev, ...updatedData };
      localStorage.setItem(
        "customer_profile",
        JSON.stringify({
          firstName: newCustomer.firstName,
          lastName: newCustomer.lastName,
          profilePicture: newCustomer.profilePicture,
        })
      );
      return newCustomer;
    });
  };

  const isCustomerAuthenticated = () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return false;

      const { exp } = jwtDecode(token);
      if (Date.now() > exp * 1000) {
        logOut();
        return false;
      }
      return true;
    } catch (err) {
      console.error("Token validation error:", err);
      logOut();
      return false;
    }
  };

  useEffect(() => {
    setCustomerFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        logOut,
        isCustomerAuthenticated,
        setCustomerFromToken,
        updateCustomerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
