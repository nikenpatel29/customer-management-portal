import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import {login as performLogin} from "../../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const setCustomerFromToken = () => {
        try {
            let token = localStorage.getItem("access_token");
            if (token) {
                const decodedToken = jwtDecode(token);

                // Check if token is expired
                if (Date.now() >= decodedToken.exp * 1000) {
                    logOut();
                    return;
                }

                // Get stored profile data
                const storedData = JSON.parse(localStorage.getItem("customer_profile") || "{}");

                setCustomer({
                    username: decodedToken.sub,
                    roles: decodedToken.scopes,
                    firstName: storedData.firstName || '',
                    lastName: storedData.lastName || '',
                    profilePicture: storedData.profilePicture || 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            logOut();
        } finally {
            setLoading(false);
        }
    };

    const updateCustomerProfile = (updatedData) => {
        setCustomer(prevCustomer => {
            if (!prevCustomer) return null;

            const newCustomer = {
                ...prevCustomer,
                ...updatedData
            };

            // Store profile data in localStorage
            localStorage.setItem("customer_profile", JSON.stringify({
                firstName: newCustomer.firstName,
                lastName: newCustomer.lastName,
                profilePicture: newCustomer.profilePicture
            }));

            return newCustomer;
        });
    };

    // FIX: Add dependency array to prevent infinite re-renders
    useEffect(() => {
        setCustomerFromToken();
    }, []); // Empty dependency array

    const login = async (usernameAndPassword) => {
        try {
            const res = await performLogin(usernameAndPassword);
            const jwtToken = res.headers["authorization"];

            if (!jwtToken) {
                throw new Error("No authorization token received");
            }

            localStorage.setItem("access_token", jwtToken);

            const decodedToken = jwtDecode(jwtToken);
            const storedData = JSON.parse(localStorage.getItem("customer_profile") || "{}");

            setCustomer({
                username: decodedToken.sub,
                roles: decodedToken.scopes,
                firstName: storedData.firstName || '',
                lastName: storedData.lastName || '',
                profilePicture: storedData.profilePicture || 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
            });

            return res;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const logOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("customer_profile");
        setCustomer(null);
    };

    const isCustomerAuthenticated = () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                return false;
            }

            const { exp: expiration } = jwtDecode(token);
            if (Date.now() > expiration * 1000) {
                logOut();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            logOut();
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            customer,
            loading,
            login,
            logOut,
            isCustomerAuthenticated,
            setCustomerFromToken,
            updateCustomerProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;