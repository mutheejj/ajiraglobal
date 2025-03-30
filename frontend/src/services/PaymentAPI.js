import axios from './axiosConfig';

const PaymentAPI = {
    // M-Pesa Payment
    initiateMpesaPayment: async (phoneNumber, amount) => {
        try {
            const response = await axios.post('/api/payments/mpesa/initiate/', {
                phone_number: phoneNumber,
                amount: amount
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Check M-Pesa payment status
    checkMpesaStatus: async (transactionId) => {
        try {
            const response = await axios.get(`/api/payments/mpesa/status/${transactionId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Card Payment
    processCardPayment: async (paymentDetails) => {
        try {
            const response = await axios.post('/api/payments/card/process/', paymentDetails);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get payment history
    getPaymentHistory: async () => {
        try {
            const response = await axios.get('/api/payments/history/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default PaymentAPI;