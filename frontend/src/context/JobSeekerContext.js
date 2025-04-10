import React, { createContext, useState, useContext, useEffect } from 'react';
import JobAPI from '../services/JobAPI';

const JobSeekerContext = createContext();

export const JobSeekerProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await JobAPI.getJobSeekerProfile();
            setProfile(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);

            // Check if profileData is FormData
            const isFormData = profileData instanceof FormData;

            let data;
            if (!isFormData) {
                // Clean up the profile data by removing undefined or null values
                const cleanProfileData = Object.fromEntries(
                    Object.entries(profileData).filter(([_, value]) => value !== undefined && value !== null)
                );

                // When dealing with JSON data, we can include more context
                console.log('Updating profile with JSON data:', cleanProfileData);
                
                data = await JobAPI.updateJobSeekerProfile(cleanProfileData);
            } else {
                // For FormData, just send it as is
                console.log('Updating profile with FormData');
                
                // Don't use axios defaults - explicitly set the content type for file uploads
                data = await JobAPI.updateJobSeekerProfile(profileData);
            }
            
            if (data) {
                console.log('Profile update successful, received data:', data);
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...data
                }));
            }
            
            return true;
        } catch (err) {
            console.error('Error updating profile:', err);
            let errorMessage = 'An error occurred while updating the profile';
            
            if (err.response?.data) {
                const errorData = err.response.data;
                console.log('Error response data:', errorData);
                
                if (typeof errorData === 'object' && errorData !== null) {
                    // Handle validation errors from the backend
                    errorMessage = Object.entries(errorData)
                        .map(([field, errors]) => {
                            const errorText = Array.isArray(errors) ? errors.join(', ') : String(errors);
                            return `${field}: ${errorText}`;
                        })
                        .join('\n');
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage); // Throw error to be caught by the component
        } finally {
            setLoading(false);
        }
    };

    const uploadResume = async (formData) => {
        try {
            const data = await JobAPI.uploadResume(formData);
            setProfile(prev => ({ ...prev, resume: data.resume }));
            return true;
        } catch (err) {
            console.error('Error uploading resume:', err);
            return false;
        }
    };

    const uploadPortfolio = async (formData) => {
        try {
            const data = await JobAPI.uploadPortfolio(formData);
            setProfile(prev => ({ ...prev, portfolio: data.portfolio }));
            return true;
        } catch (err) {
            console.error('Error uploading portfolio:', err);
            return false;
        }
    };

    const fetchApplications = async () => {
        try {
            setApplicationsLoading(true);
            const data = await JobAPI.getJobApplications();
            setApplications(data);
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setApplicationsLoading(false);
        }
    };

    const applyForJob = async (jobId, applicationData) => {
        try {
            const data = await JobAPI.applyForJob(jobId, applicationData);
            setApplications(prev => [...prev, data]);
            return true;
        } catch (err) {
            console.error('Error applying for job:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchApplications();
    }, []);
    
    // Add a function to refresh the profile data
    const refreshProfile = async () => {
        await fetchProfile();
    };

    const value = {
        profile,
        loading,
        error,
        applications,
        applicationsLoading,
        updateProfile,
        uploadResume,
        uploadPortfolio,
        applyForJob,
        refreshProfile,
        refreshApplications: fetchApplications
    };

    return (
        <JobSeekerContext.Provider value={value}>
            {children}
        </JobSeekerContext.Provider>
    );
};

export const useJobSeeker = () => {
    const context = useContext(JobSeekerContext);
    if (!context) {
        throw new Error('useJobSeeker must be used within a JobSeekerProvider');
    }
    return context;
};