import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, TextField, Button, CircularProgress } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState(0);
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const { mode } = useTheme();

    const handlePaymentMethodChange = (event, newValue) => {
        setPaymentMethod(newValue);
    };

    const handleMpesaPayment = async () => {
        setLoading(true);
        try {
            // TODO: Implement M-Pesa payment logic
            console.log('Processing M-Pesa payment...');
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardPayment = async () => {
        setLoading(true);
        try {
            // TODO: Implement card payment logic
            console.log('Processing card payment...');
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Payment
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        centered
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="M-Pesa" />
                        <Tab label="Debit Card" />
                    </Tabs>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Amount (KES)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {paymentMethod === 0 ? (
                        // M-Pesa Form
                        <Box>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="254XXXXXXXXX"
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleMpesaPayment}
                                disabled={loading || !amount || !phoneNumber}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Pay with M-Pesa'}
                            </Button>
                        </Box>
                    ) : (
                        // Card Payment Form
                        <Box>
                            <TextField
                                fullWidth
                                label="Card Number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="Expiry Date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="CVV"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    type="password"
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleCardPayment}
                                disabled={loading || !amount || !cardNumber || !expiryDate || !cvv}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Pay with Card'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default PaymentPage;