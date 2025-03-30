import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatPage from '../pages/ChatPage';

const ChatRoute = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Only allow clients and job seekers to access the chat
    if (!user || !['client', 'job-seeker'].includes(user.user_type)) {
        return <Navigate to="/" />;
    }

    return <ChatPage />;
};

export default ChatRoute;