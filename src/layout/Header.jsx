import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to: '/', text: 'Login' },
  { to: '/register', text: 'Register' },
];

const userNav = [
  { to: '/', text: 'Home' },
  { to: '/products', text: 'Products' },
  { to: '/table-reservations', text: 'Table Reservations' },
  { to: '/confirm', text: 'OrderPage' },
];

const AdminNav = [
  { to: '/products', text: 'Products' },
  { to: '/table-reservations', text: 'Table Reservations' },
  { to: '/AdminOrder', text: 'AdminOrder' },
  { to: '/Adproduct', text: 'AddProductForm' },
  { to: '/UserProfile', text: 'UserProfileForm' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? (user.role === 'ADMIN' ? AdminNav : userNav) : guestNav;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-900 p-4 shadow-lg border-b-4 border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={user?.imgprofile || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKG3NYPSNCVwyicMNQPkiIy5FsXp5RYDQp9w&usqp=CAU'}
            alt="Profile"
            className="w-14 h-14 rounded-full border-2 border-gray-300 shadow-lg object-cover mr-4"
          />
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm">Hello,</span>
            <span className="text-gray-100 text-lg font-semibold">{user?.username || 'Guest'}</span>
          </div>
        </div>

        <ul className="flex space-x-4">
          {finalNav.map((el, index) => (
            <li key={index}>
              <Link
                to={el.to}
                className="font-bold text-white transition duration-300 py-2 px-4 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
              >
                {el.text}
              </Link>
            </li>
          ))}
        </ul>

        {user?.id && (
          <div className="flex space-x-2">
            <Link
              to="/profile"
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
