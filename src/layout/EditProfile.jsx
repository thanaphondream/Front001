import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    phoneNumber: '',
    imgprofile: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfileData(data);
      setOriginalData(data);
    } catch (error) {
      setError('Failed to fetch profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/updateProfile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.msg || 'Failed to update profile');
      }

      navigate('/profile');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  if (!profileData.username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="px-4 py-5 sm:p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-6 mb-4">
              {profileData.imgprofile ? (
                <img
                  src={profileData.imgprofile}
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
              <input
                type="text"
                name="imgprofile"
                value={profileData.imgprofile}
                onChange={handleChange}
                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <Link
              to="/profile"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
