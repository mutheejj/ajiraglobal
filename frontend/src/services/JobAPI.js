import axios from './axiosConfig';

const API_BASE_URL = '/api';

class JobAPI {
    static async getJobSeekerProfile() {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile/job-seeker/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    static async updateJobSeekerProfile(profileData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/profile/job-seeker/`, profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
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
}

export default JobAPI;