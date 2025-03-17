import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('system');
    const [systemTheme, setSystemTheme] = useState('light');

    useEffect(() => {
        // Load saved theme preference
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode) {
            setMode(savedMode);
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const currentTheme = mode === 'system' ? systemTheme : mode;

    const theme = createTheme({
        palette: {
            mode: currentTheme,
            primary: {
                main: '#1976d2',
                light: '#42a5f5',
                dark: '#1565c0',
            },
            secondary: {
                main: '#9c27b0',
                light: '#ba68c8',
                dark: '#7b1fa2',
            },
            background: {
                default: currentTheme === 'dark' ? '#121212' : '#f5f5f5',
                paper: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
    });

    const toggleTheme = (newMode) => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};