import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import {getCustomers, login as performLogin} from "../../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    const [customer, setCustomer] = useState(null);

    const setCustomerFromToken = () => {
        let token = localStorage.getItem("access_token");
        if (token) {
            token = jwtDecode(token);

            // Get stored profile data
            const storedData = JSON.parse(localStorage.getItem("customer_profile") || "{}");

            setCustomer({
                username: token.sub,
                roles: token.scopes,
                firstName: storedData.firstName || '',
                lastName: storedData.lastName || '',
                profilePicture: storedData.profilePicture || 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
            })
        }
    }

    const updateCustomerProfile = (updatedData) => {
        setCustomer(prevCustomer => {
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

    useEffect(() => {
        setCustomerFromToken()
    }, [])

    const login = async (usernameAndPassword) => {
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword).then(res => {
                const jwtToken = res.headers["authorization"];
                localStorage.setItem("access_token", jwtToken);

                const decodedToken = jwtDecode(jwtToken);

                const storedData = JSON.parse(localStorage.getItem("customer_profile") || "{}");

                setCustomer({
                    username: decodedToken.sub,
                    roles: decodedToken.scopes,
                    firstName: storedData.firstName || '',
                    lastName: storedData.lastName || '',
                    profilePicture: storedData.profilePicture || 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                })
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    const logOut = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("customer_profile")
        setCustomer(null)
    }

    const isCustomerAuthenticated = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return false;
        }
        const { exp: expiration } = jwtDecode(token);
        if (Date.now() > expiration * 1000) {
            logOut()
            return false;
        }
        return true;
    }

    return (
        <AuthContext.Provider value={{
            customer,
            login,
            logOut,
            isCustomerAuthenticated,
            setCustomerFromToken,
            updateCustomerProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;