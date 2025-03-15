import React from 'react';
import '../styles/UserTypeSelection.css';

function UserTypeSelection({ onSelect }) {
    return (
        <div className="user-type-selection">
            <h2>Choose Your Account Type</h2>
            <div className="user-type-options">
                <button
                    className="user-type-button client"
                    onClick={() => onSelect('client')}
                >
                    <svg className="user-type-icon" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8-2h-2v-2h2v2zm0-4h-2V6h2v2z"/>
                    </svg>
                    <h3>I'm a Client</h3>
                    <p>Post jobs and find the perfect talent for your projects</p>
                </button>
                
                <button
                    className="user-type-button job-seeker"
                    onClick={() => onSelect('job-seeker')}
                >
                    <svg className="user-type-icon" viewBox="0 0 24 24">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                    </svg>
                    <h3>I'm a Job Seeker</h3>
                    <p>Discover exciting opportunities and advance your career</p>
                </button>
            </div>
        </div>
    );
}

export default UserTypeSelection;