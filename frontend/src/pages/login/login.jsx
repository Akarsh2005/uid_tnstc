import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Backend logic ignored as per request
    navigate('/home');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 login-background"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSydGp55Gzh6suqPHOpxXpyNgEDcVk5qb3Ci40U3LY_41NyWI2BflJCBsAZ2elG69NvDoc&usqp=CAU')`,
      }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-md hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-semibold"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 sm:mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;