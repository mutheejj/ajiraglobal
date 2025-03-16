import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const fetchCSRFToken = async () => {
        try {
            await fetch('/api/auth/csrf/', {
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    };

    const login = async (email, password) => {
        try {
            await fetchCSRFToken();
            const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];

            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {

                const userData = data.user;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on user type
                if (userData.user_type === 'client') {
                    navigate('/client-dashboard');
                } else if (userData.user_type === 'job-seeker') {
                    navigate('/job-seeker-dashboard');
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};