import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [name,setName] =  useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('https://aims-portal.vercel.app/api/auth/signup', { email, role, name});
      alert('Signup successful. Please check your email for OTP to log in.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error during signup');
    }
  };

  const goToLogin = async () => {
    try {
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error in going to login');
    }
  }

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />
        <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />
        <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        >
            <option value="student">Student</option>
            <option value="course_instructor">Course Instructor</option>
            <option value="faculty_advisor">Faculty Advisor</option>
        </select>
        <button
            onClick={handleSignup}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 mb-3"
        >
            Signup
        </button>
        <button
            onClick={goToLogin}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
            Go to Login
        </button>
        </div>
    </div>
  );
};

export default Signup;
