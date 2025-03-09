import React from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';

function NavigationGuide() {
    const navigate = useNavigate();

    // Programmatic navigation
    const handleButtonClick = () => {
        navigate('/about');
    };

    // Navigation with state
    const handleLoginClick = () => {
        navigate('/login', { 
            state: { from: 'navigation-guide' },
            replace: false  // doesn't replace history entry
        });
    };

    // Go back example
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="navigation-guide">
            <h2>Different Ways to Navigate</h2>
            
            {/* 1. Using Link component (Basic navigation) */}
            <section>
                <h3>1. Link Component</h3>
                <Link to="/about">Go to About (Link)</Link>
            </section>

            {/* 2. Using NavLink (with active state) */}
            <section>
                <h3>2. NavLink Component</h3>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    Home (NavLink)
                </NavLink>
            </section>

            {/* 3. Programmatic navigation */}
            <section>
                <h3>3. Programmatic Navigation</h3>
                <button onClick={handleButtonClick}>
                    Go to About (Programmatic)
                </button>
            </section>

            {/* 4. Navigation with state */}
            <section>
                <h3>4. Navigation with State</h3>
                <button onClick={handleLoginClick}>
                    Go to Login (with state)
                </button>
            </section>

            {/* 5. History navigation */}
            <section>
                <h3>5. History Navigation</h3>
                <button onClick={goBack}>Go Back</button>
            </section>
        </div>
    );
}

export default NavigationGuide;
