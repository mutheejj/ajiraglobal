import axios from 'axios';

const API_URL = '/api';

const companyService = {
  getCompanyProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/company/profile/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCompanyProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/company/profile/`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecruitmentSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/company/settings/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateRecruitmentSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_URL}/company/settings/`, settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/company/applications/recent/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default companyService;