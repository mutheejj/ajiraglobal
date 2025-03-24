import React, { createContext, useState, useContext, useEffect } from 'react';
import SavedJobsAPI from '../services/SavedJobsAPI';

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const data = await SavedJobsAPI.getSavedJobs();
            setSavedJobs(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch saved jobs');
            console.error('Error fetching saved jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveJob = async (jobId) => {
        try {
            await SavedJobsAPI.saveJob(jobId);
            const jobDetails = await SavedJobsAPI.getJobDetails(jobId);
            setSavedJobs(prev => [...prev, jobDetails]);
            return true;
        } catch (err) {
            console.error('Error saving job:', err);
            return false;
        }
    };

    const unsaveJob = async (jobId) => {
        try {
            await SavedJobsAPI.unsaveJob(jobId);
            setSavedJobs(prev => prev.filter(job => job.id !== jobId));
            return true;
        } catch (err) {
            console.error('Error removing saved job:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const value = {
        savedJobs,
        loading,
        error,
        saveJob,
        unsaveJob,
        refreshSavedJobs: fetchSavedJobs
    };

    return (
        <SavedJobsContext.Provider value={value}>
            {children}
        </SavedJobsContext.Provider>
    );
};

export const useSavedJobs = () => {
    const context = useContext(SavedJobsContext);
    if (!context) {
        throw new Error('useSavedJobs must be used within a SavedJobsProvider');
    }
    return context;
};