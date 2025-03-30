import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentStatus = ({ status, message, isLoading }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress />
                    <Typography variant="body1">Processing your payment...</Typography>
                </Box>
            );
        }

        if (status === 'success') {
            return (
                <Alert
                    icon={<CheckCircleOutlineIcon fontSize="large" />}
                    severity="success"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            fontSize: '2rem'
                        }
                    }}
                >
                    <Box>
                        <Typography variant="h6" component="div">
                            Payment Successful!
                        </Typography>
                        <Typography variant="body2">{message}</Typography>
                    </Box>
                </Alert>
            );
        }

        if (status === 'error') {
            return (
                <Alert
                    icon={<ErrorOutlineIcon fontSize="large" />}
                    severity="error"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            fontSize: '2rem'
                        }
                    }}
                >
                    <Box>
                        <Typography variant="h6" component="div">
                            Payment Failed
                        </Typography>
                        <Typography variant="body2">{message}</Typography>
                    </Box>
                </Alert>
            );
        }

        return null;
    };

    return (
        <Box sx={{ mt: 3, width: '100%' }}>
            {renderContent()}
        </Box>
    );
};

export default PaymentStatus;