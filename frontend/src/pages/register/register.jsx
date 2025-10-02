import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    password: '',
    phone: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 register-background"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSydGp55Gzh6suqPHOpxXpyNgEDcVk5qb3Ci40U3LY_41NyWI2BflJCBsAZ2elG69NvDoc&usqp=CAU')`,
      }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Register</h2>
        <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.emailId}
              onChange={e => setFormData({ ...formData, emailId: e.target.value })}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>
        <p className="mt-4 sm:mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;