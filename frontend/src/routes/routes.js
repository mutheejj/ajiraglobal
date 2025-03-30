import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/login';
import Signup from '../pages/signup';
import ForgotPassword from '../pages/forgot-password';
import ClientDashboard from '../pages/ClientDashboard';
import JobSeekerDashboard from '../pages/JobSeekerDashboard';
import PaymentPage from '../pages/PaymentPage';
import ChatRoute from './ChatRoute';

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
    },
    {
        path: '/payment',
        element: PaymentPage
    },
    {
        path: '/chat',
        element: ChatRoute
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
