import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);

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
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-6">
            <img 
              src="/path-to-default-profile-picture.jpg" 
              alt="Profile Picture" 
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{profileData.username}</h2>
              <p className="text-gray-600">Email: {profileData.email}</p>
              <p className="text-gray-600">User ID: {profileData.id}</p>
              <p className="text-gray-600">Role: <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{profileData.role}</span></p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50">
          <Link 
            to="/edit-profile" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;