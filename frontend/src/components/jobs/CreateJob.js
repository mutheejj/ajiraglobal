import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    skills: [],
    experience_level: 'entry',
    project_type: 'full_time',
    budget: '',
    currency: 'KSH',
    duration: '',
    location: '',
    remote_work: false,
    status: 'draft'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'skills') {
      // Handle skills as a comma-separated list
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(skill => skill.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure budget is a valid decimal
      const budgetValue = parseFloat(formData.budget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      // Ensure duration is a positive integer
      const durationValue = parseInt(formData.duration);
      if (isNaN(durationValue) || durationValue <= 0) {
        toast.error('Please enter a valid duration in days');
        return;
      }

      // Ensure at least one skill is provided
      if (formData.skills.length === 0) {
        toast.error('Please enter at least one skill');
        return;
      }

      const response = await axios.post('/api/jobs/', {
        ...formData,
        budget: budgetValue.toFixed(2),
        duration: durationValue
      });

      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.detail || 'Failed to create job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. React, Python, Django"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Experience Level</label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="entry">Entry Level</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Project Type</label>
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Budget</label>
          <div className="flex gap-4">
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded"
            >
              <option value="KSH">KSH</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="remote_work"
              checked={formData.remote_work}
              onChange={handleChange}
              className="mr-2"
            />
            Remote Work Available
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;