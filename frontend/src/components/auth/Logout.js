import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Perform logout logic (e.g., clear authentication token, reset user state)
        logout();

        // Redirect to the login page
        navigate('/signin');

        // Perform logout actions (e.g., clear session, remove tokens)
    };

    // Call handleLogout when the component mounts (or when logout is triggered)
    React.useEffect(() => {
        handleLogout();
    }, []);

    return null;
};

export default Logout;
