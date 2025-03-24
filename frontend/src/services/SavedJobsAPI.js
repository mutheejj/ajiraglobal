import axios from 'axios';

const API_BASE_URL = '/api';

class SavedJobsAPI {
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

    static async getJobDetails(jobId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default SavedJobsAPI;