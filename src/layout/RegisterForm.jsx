import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!input.username || !input.password || !input.confirmPassword || !input.email) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all required fields!',
        });
        return;
      }

      if (input.password !== input.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please make sure your passwords match!',
        });
        return;
      }

      const response = await axios.post('http://localhost:8889/auth/register', input);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration successful!',
        });

        setInput({ // Reset form after successful registration
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
        });

        // Navigate to login page
        setTimeout(() => navigate('/loginForm'), 1500); // Redirect after 1.5 seconds to allow the alert to be visible
      }
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred during registration.',
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <div className="register-container text-white">
            <div className="text-3xl mb-4 text-center font-bold text-gray-800">Register Form</div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 text-White" 
                name="username"
                value={input.username}
                onChange={handleChange}
              />

              <input
                type="email"
                placeholder="Email"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 text-White"
                name="email"
                value={input.email}
                onChange={handleChange}
              />

              <input
                type="password"
                placeholder="Password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 text-White"
                name="password"
                value={input.password}
                onChange={handleChange}
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 text-White"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={handleChange}
              />

              <div className="flex justify-center items-center">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600">
                  Submit
                </button>
                <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full ml-4 focus:outline-none focus:ring-2 focus:ring-gray-600" onClick={() => setInput({ // Reset form when reset button clicked
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                  })}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
