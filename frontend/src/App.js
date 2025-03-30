import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/login';
import Signup from './pages/signup';
import PaymentPage from './pages/PaymentPage';
import ClientDashboard from './pages/ClientDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { JobSeekerProvider } from './context/JobSeekerContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import { CssBaseline } from '@mui/material';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CssBaseline />
                <JobSeekerProvider>
                    <SavedJobsProvider>
                        <AppContent />
                    </SavedJobsProvider>
                </JobSeekerProvider>
            </ThemeProvider>
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
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <JobSeekerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route 
                        path="/client-dashboard" 
                        element={
                            isAuthenticated && user.user_type === 'client' ? (
                                <ClientDashboard />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    <Route 
                        path="/job-seeker-dashboard" 
                        element={
                            isAuthenticated && user.user_type === 'job-seeker' ? (
                                <JobSeekerDashboard />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    <Route 
                        path="/payment" 
                        element={
                            isAuthenticated ? (
                                <PaymentPage />
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