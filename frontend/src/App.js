import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/login';
import Signup from './pages/signup';
import ClientDashboard from './pages/ClientDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route 
                        path="/client-dashboard" 
                        element={
                            isAuthenticated && user.userType === 'client' ? (
                                <ClientDashboard />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    <Route 
                        path="/job-seeker-dashboard" 
                        element={
                            isAuthenticated && user.userType === 'job-seeker' ? (
                                <JobSeekerDashboard />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    <Route 
                        path="*" 
                        element={<div>Page Not Found</div>} 
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;