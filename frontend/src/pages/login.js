import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { mode } = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(formData.email, formData.password);
            if (!success) {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Apply theme to document for CSS selectors to work
        document.documentElement.setAttribute('data-theme', mode);
        return () => {
            // Clean up when component unmounts
            document.documentElement.removeAttribute('data-theme');
        };
    }, [mode]);

    return (
        <div className="auth-container" data-theme={mode}>
            <div className="auth-form-container">
                <h1>Welcome Back</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="auth-links">
                        <Link to="/forgot-password">Forgot Password?</Link>
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
