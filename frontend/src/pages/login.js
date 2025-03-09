import React, { useState } from 'react';

function Login() {
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form >
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"

            
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        
            
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
