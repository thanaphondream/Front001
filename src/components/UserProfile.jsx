// src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8889/auth/getUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-white">User Profiles</h1>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-4 p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  {user.imgprofile ? (
                    <img
                      src={user.imgprofile}
                      alt="Profile Picture"
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-400"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Phone Number: {user.phoneNumber || 'Not provided'}</p>
                    <p className="text-gray-600">Role: <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{user.role}</span></p>
                    <Link
                      to={`/EditUserProfile/${user.id}`}
                      className="text-blue-600 hover:text-blue-500 mt-2 inline-block"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfiles;
