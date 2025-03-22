import React from 'react';
import '../styles/AuthStyles.css';

function JobSeekerRegistrationForm({ formData, onChange, error }) {
    const getFieldError = (fieldName) => {
        if (!error) return null;
        const errorLines = error.split('\n');
        const fieldError = errorLines.find(line => 
            line.toLowerCase().startsWith(fieldName.toLowerCase())
        );
        return fieldError ? fieldError.split(': ')[1] : null;
    };

    return (
        <div className="job-seeker-registration">
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={onChange}
                    required
                    placeholder="Enter your first name"
                />
                {getFieldError('first name') && (
                    <div className="field-error">{getFieldError('first name')}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={onChange}
                    required
                    placeholder="Enter your last name"
                />
                {getFieldError('last name') && (
                    <div className="field-error">{getFieldError('last name')}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="profession">Professional Title</label>
                <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession || ''}
                    onChange={onChange}
                    required
                    placeholder="e.g. Software Engineer, Project Manager"
                />
                {getFieldError('profession') && (
                    <div className="field-error">{getFieldError('profession')}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <select
                    id="experience"
                    name="experience"
                    value={formData.experience || ''}
                    onChange={onChange}
                    required
                >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                </select>
                {getFieldError('experience') && (
                    <div className="field-error">{getFieldError('experience')}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills || ''}
                    onChange={onChange}
                    required
                    placeholder="Enter your key skills (separated by commas)"
                    rows="3"
                />
                {getFieldError('skills') && (
                    <div className="field-error">{getFieldError('skills')}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="bio">Professional Summary</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={onChange}
                    placeholder="Brief description of your professional background and career goals"
                    rows="4"
                />
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default JobSeekerRegistrationForm;