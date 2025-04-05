import axios from './axiosConfig';

const API_BASE_URL = '/api';

class JobAPI {
    static async getProjects() {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async createProject(projectData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/projects/`, projectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async updateProject(projectId, projectData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/projects/${projectId}/`, projectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async deleteProject(projectId) {
        try {
            await axios.delete(`${API_BASE_URL}/projects/${projectId}/`);
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async getJobSeekerProfile() {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile/job-seeker/profile/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async updateJobSeekerProfile(profileData) {
        try {
            // Check if profileData is FormData
            const isFormData = profileData instanceof FormData;
            
            // Log the data being sent for debugging
            if (isFormData) {
                console.log('Sending FormData to server:');
                for (let pair of profileData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }
            } else {
                console.log('Sending JSON data to server:', profileData);
            }
            
            // Changed from PUT to PATCH to match backend expectations
            const response = await axios.patch(
                `${API_BASE_URL}/profile/job-seeker/profile/`, 
                profileData,
                isFormData ? {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                } : {}
            );
            return response.data;
        } catch (error) {
            console.error('Error in updateJobSeekerProfile:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            throw error;
        }
    }

    static async getSavedJobs() {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/saved/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async saveJob(jobId) {
        try {
            const response = await axios.post(`${API_BASE_URL}/jobs/${jobId}/save/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async unsaveJob(jobId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}/save/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async getJobApplications() {
        try {
            const response = await axios.get(`${API_BASE_URL}/applications/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async applyForJob(jobId, applicationData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/jobs/${jobId}/apply/`, applicationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async uploadResume(formData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/profile/resume/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async uploadPortfolio(formData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/profile/portfolio/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async getAllJobs() {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default JobAPI;