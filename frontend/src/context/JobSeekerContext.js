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
            const data = await JobAPI.updateJobSeekerProfile(profileData);
            setProfile(data);
            setError(null);
            return true;
        } catch (err) {
            setError('Failed to update profile');
            console.error('Error updating profile:', err);
            return false;
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

    const value = {
        profile,
        loading,
        error,
        applications,
        applicationsLoading,
        updateProfile,
        uploadResume,
        applyForJob,
        refreshProfile: fetchProfile,
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