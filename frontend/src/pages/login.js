import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            // TODO: Implement login logic with API
            console.log('Login attempt with:', formData);
            // After successful login, the API should return the user type
            // For now, we'll simulate it
            const mockUserType = 'client'; // This would come from the API
            setUserType(mockUserType);
            
            // Redirect based on user type
            if (mockUserType === 'client') {
                // Redirect to client dashboard
                console.log('Redirecting to client dashboard');
            } else {
                // Redirect to job seeker dashboard
                console.log('Redirecting to job seeker dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
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
