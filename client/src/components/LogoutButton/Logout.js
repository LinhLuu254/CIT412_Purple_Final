import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'src/components/Header/Header.css'

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the JWT token from local storage
        localStorage.removeItem('accessToken');
        // Redirect the user to login page
        navigate('/login');
    };

    return (
        <a className="Header-link" onClick={handleLogout}>Logout</a>
    );
}

export default LogoutButton;