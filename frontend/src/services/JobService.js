import axios from 'axios';

const API_URL = '/api';

const jobService = {
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getJobById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${id}/`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteJob: async (id) => {
    try {
      await axios.delete(`${API_URL}/jobs/${id}/`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  changeJobStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/jobs/${id}/status/`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default jobService;