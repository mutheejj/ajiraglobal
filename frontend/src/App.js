import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
    
    const isAuthenticated = false; 

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
                        path="/dashboard" 
                        element={
                            isAuthenticated ? (
                                <div>Dashboard Content</div>
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