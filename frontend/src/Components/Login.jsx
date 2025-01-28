import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpLogin, setIsOtpLogin] = useState(true); // Toggle state
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      await axios.post('https://aims-portal.vercel.app/api/auth/login', { otpEmail });
      alert('OTP sent to your email');
    } catch (error) {
      console.error(error);
      alert('Error requesting OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('https://aims-portal.vercel.app/api/auth/verify-otp', { otpEmail, otp });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      const { role } = response.data;
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'course_instructor') {
        navigate('/instructor-dashboard');
      } else if (role === 'faculty_advisor') {
        navigate('/advisor-dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Error verifying OTP');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://aims-portal.vercel.app/api/auth/passlogin', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      const { role } = response.data;
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'course_instructor') {
        navigate('/instructor-dashboard');
      } else if (role === 'faculty_advisor') {
        navigate('/advisor-dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-transparent to-black opacity-80">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>

        
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsOtpLogin(true)}
            className={`px-6 py-2 text-lg font-semibold rounded-l-lg ${
              isOtpLogin
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            OTP Login
          </button>
          <button
            onClick={() => setIsOtpLogin(false)}
            className={`px-6 py-2 text-lg font-semibold rounded-r-lg ${
              !isOtpLogin
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Password Login
          </button>
        </div>

        {isOtpLogin ? (
          // OTP Login Form
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Login with OTP</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
              onClick={handleRequestOtp}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 mb-4"
            >
              Request OTP
            </button>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Verify OTP
            </button>
          </div>
        ) : (
          // Password Login Form
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Login with Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={goToSignup}
              className="text-indigo-600 hover:underline focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
