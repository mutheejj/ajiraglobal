import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthStyles.css';

function ForgotPassword() {
    const [step, setStep] = useState('request'); // request, verify, reset
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (step === 'request') {
                // TODO: Call API to send reset code
                console.log('Reset code requested for:', formData.email);
                setStep('verify');
            } else if (step === 'verify') {
                // TODO: Call API to verify code
                console.log('Verification attempt with code:', formData.verificationCode);
                setStep('reset');
            } else if (step === 'reset') {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                // TODO: Call API to reset password
                console.log('Password reset attempt with:', formData.newPassword);
                // Redirect to login after successful reset
                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderRequestForm = () => (
        <form className="auth-form" onSubmit={handleSubmit}>
            <p>Enter your email address and we'll send you a code to reset your password.</p>
            
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

            <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
            >
                {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>

            <div className="auth-links">
                <Link to="/login">Back to Login</Link>
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
                {loading ? 'Verifying...' : 'Verify Code'}
            </button>
        </form>
    );

    const renderResetForm = () => (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter new password"
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
                    placeholder="Confirm new password"
                />
            </div>

            <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
            >
                {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
        </form>
    );

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1>Reset Password</h1>
                {error && <div className="error-message">{error}</div>}
                
                {step === 'request' && renderRequestForm()}
                {step === 'verify' && renderVerificationForm()}
                {step === 'reset' && renderResetForm()}
            </div>
        </div>
    );
}

export default ForgotPassword;