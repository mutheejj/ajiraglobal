import React from 'react';
import '../styles/AuthStyles.css';

function ClientRegistrationForm({ formData, onChange, error }) {
    const getFieldError = (fieldName) => {
        if (!error) return null;
        const errorLines = error.split('\n');
        const fieldError = errorLines.find(line => line.toLowerCase().startsWith(fieldName.toLowerCase()));
        return fieldError ? fieldError.split(': ')[1] : null;
    };

    const validateField = (fieldName, value) => {
        if (!value || value.trim() === '') {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        return null;
    };

    return (
        <div className="client-registration">
            <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={onChange}
                    required
                    placeholder="Enter your company name"
                />
            </div>

            <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <select
                    id="industry"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={onChange}
                    required
                >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="companySize">Company Size</label>
                <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize || ''}
                    onChange={onChange}
                    required
                >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="website">Company Website</label>
                <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={onChange}
                    placeholder="https://your-company.com"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Company Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={onChange}
                    placeholder="Tell us about your company and hiring needs"
                    rows="4"
                />
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default ClientRegistrationForm;