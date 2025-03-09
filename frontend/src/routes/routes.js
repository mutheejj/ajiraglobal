import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export const routes = [
    {
        path: '/',
        element: Home,
        exact: true
    },
    {
        path: '/about',
        element: About
    },
    {
        path: '/login',
        element: Login
    },
    {
        path: '/signup',
        element: Signup
    }
];

// Protected route example
export const isAuthenticated = () => {
    // Check if user is authenticated
    return localStorage.getItem('token') !== null;
};

export const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    
    if (!isAuthenticated()) {
        return navigate('/login');
    }
    
    return children;
};
