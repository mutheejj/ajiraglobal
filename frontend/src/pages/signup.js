import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';
import UserTypeSelection from '../components/UserTypeSelection';
import ClientRegistrationForm from '../components/ClientRegistrationForm';
import JobSeekerRegistrationForm from '../components/JobSeekerRegistrationForm';

function Signup() {
    const [step, setStep] = useState('select-type'); // select-type, register, verify, welcome
    const [userType, setUserType] = useState(null); // client or job-seeker
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setStep('register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (step === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                // TODO: Call API to register user and send verification code
                console.log('Registration attempt with:', { ...formData, userType });
                setStep('verify');
            } else if (step === 'verify') {
                // TODO: Call API to verify code
                console.log('Verification attempt with code:', formData.verificationCode);
                setStep('welcome');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderRegisterForm = () => (
        <form className="auth-form" onSubmit={handleSubmit}>
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
                    placeholder="Create a password"
                    minLength="8"
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                />
            </div>

            {userType === 'client' && (
                <ClientRegistrationForm
                    formData={formData}
                    onChange={handleChange}
                    error={error}
                />
            )}

            {userType === 'job-seeker' && (
                <JobSeekerRegistrationForm
                    formData={formData}
                    onChange={handleChange}
                    error={error}
                />
            )}

            <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-links">
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </form>
    );

    const renderVerificationForm = () => (
        <form className="auth-form" onSubmit={handleSubmit}>
            <p>We've sent a verification code to your email. Please enter it below:</p>
            
            <div className="verification-code-input">
                <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    maxLength="6"
                    required
                    placeholder="000000"
                />
            </div>

            <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
            >
                {loading ? 'Verifying...' : 'Verify Email'}
            </button>
        </form>
    );

    const renderWelcomeMessage = () => (
        <div className="welcome-message">
            <h2>Welcome to Ajira Global!</h2>
            <p>Your account has been successfully created and verified.</p>
            <Link to="/login" className="auth-button">Proceed to Login</Link>
        </div>
    );

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1>{step === 'welcome' ? 'Success!' : 'Create Account'}</h1>
                {error && <div className="error-message">{error}</div>}
                
                {step === 'select-type' && <UserTypeSelection onSelect={handleUserTypeSelect} />}
                {step === 'register' && renderRegisterForm()}
                {step === 'verify' && renderVerificationForm()}
                {step === 'welcome' && renderWelcomeMessage()}
            </div>
        </div>
    );
}

export default Signup;