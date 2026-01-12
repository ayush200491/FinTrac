import React, { createContext, useContext, useState, useEffect } from 'react';
import {useUser} from '../hooks/useUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);

// setIsLoading(false)
    const login = () => {
        // Perform login logic...
        // setIsLoading(true)
        setIsLoggedIn(true);
        setIsLoading(false)
    };
    // const { setLoggedInUser } = useUser();

    // useEffect(() => {
    //     // Fetch user data from /profile endpoint
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/users/{username}');
    //             if (response.ok) {
    //                 const userData = await response.json();
    //                 console.log('ud',userData)
    //                 setLoggedInUserId(userData.id);
    //             } else {
    //                 console.error('Failed to fetch user data');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchUserData();
    // }, []);
   
    const logout = () => {
        // Perform logout logic...
        setIsLoggedIn(false);
        setLoggedInUser(null);
        // Clear any user-related data from local storage or session storage
    };

    const isAuthenticated = isLoggedIn;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, loggedInUser, setLoggedInUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Integration Steps:

// - Wrap your application with the AuthProvider to provide authentication context to all components.
// - Use the useAuth hook in components that need access to authentication state or functions (e.g., LoginForm, LogoutForm).
// - Use the useUser hook in components that need user data (e.g., UserProfile) and set user data after successful login in the LoginForm.
// - Trigger the logout process using the logout function provided by the useAuth hook in the LogoutForm.