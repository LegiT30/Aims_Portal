import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Request Body1111:", { name });
      await axios.post(
        'http://localhost:8081/api/courses/add',
        { name },
        { headers: { Authorization: token,'Content-Type': 'application/json'  } }
      );
      alert('Course added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error adding course');
    }
  };

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Course</h2>
        <input
          type="text"
          placeholder="Enter course name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleAddCourse}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCourse;