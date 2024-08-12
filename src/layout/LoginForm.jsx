import axios from 'axios';
import { useState } from "react";
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import './LoginForm.css'; // Import custom styles

export default function LoginForm() {
  const { setUser } = useAuth();
  const [input, setInput] = useState({
    username: '', 
    password: ''
  });

  const handleChange = e => {
    setInput(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => { 
    e.preventDefault();
    if (!input.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter your password!',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8889/auth/login', input);
      localStorage.setItem('token', response.data.token);

      const userResponse = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
    } catch(err) {
      // Handle invalid credentials
      if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid username or password!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'An unexpected error occurred',
        });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center" style={{backgroundImage: 'url("https://media.istockphoto.com/id/1344743512/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%97%E0%B9%87%E0%B8%AD%E0%B8%9B%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%82%E0%B8%9A%E0%B9%80%E0%B8%81%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%82%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%AD%E0%B8%A5%E0%B8%81%E0%B8%AD%E0%B8%AE%E0%B8%AD%E0%B8%A5%E0%B9%8C%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C.jpg?s=612x612&w=0&k=20&c=puCcsQKVU3Ey-hMezrC7n02SXkJKlYaTbp2BTSyaT9c=")'}}>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-black text-3xl mb-4 text-center font-bold">Login Form</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-black font-bold">Username or Email</span>
            <input
              type="text"
              placeholder="Username or Email"
              className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
          </label>

          <label className="block mb-4">
            <span className="text-black font-bold">Password</span>
            <input
              type="password"
              placeholder="Password"
              className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300 font-bold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
