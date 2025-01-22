import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () =>{
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      await axios.post('http://localhost:8081/api/auth/login', {email });
      setStep(2);
      alert('OTP sent to your email');
    } catch (error) {
      console.error(error);
      alert('Error requesting OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/auth/verify-otp', { email, otp });
      //console.log("i am response",response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name',response.data.name);
      const { token, role } = response.data;
      console.log("i am data :" ,response.data);
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

  const goToSignup = async () => {
     try{
      navigate('/signup');
     }catch(error){
        console.error(error);
        alert('Cannot go to signup');
     }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-transparent to-black p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Login</h2>
        {step === 1 ? (
          <div>
            <label className="block text-gray-600 font-medium mb-2" htmlFor="email">
              Enter your email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleRequestOtp}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 mb-3"
            >
              Request OTP
            </button>
            <button
              onClick={goToSignup}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Signup
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-gray-600 font-medium mb-2" htmlFor="otp">
              Enter OTP:
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
