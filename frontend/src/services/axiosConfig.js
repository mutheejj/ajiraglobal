import axios from 'axios';

const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios Error:', error);
        
        if (error.response) {
            error.message = `Server error: ${error.response.status} - ${
                typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data)
            }`;
        } else if (error.request) {
            error.message = 'No response received from server. Please check your internet connection.';
        }
        
        return Promise.reject(error);
    }
);

export default axios;