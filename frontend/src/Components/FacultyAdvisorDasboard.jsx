import React, { useState,useEffect } from 'react'
import axios from 'axios';

function FacultyAdvisorDasboard() {

  const [studentApplications,setStudentApplications] = useState([]);
  const [user,setUser] = useState([]);

  useEffect(()=>{
    const fetchApplications = async () => {
      try{
        const token = localStorage.getItem('token');
        const getUser = localStorage.getItem('name');
        
        setUser(getUser);
        const response = await axios.get(
          'https://aims-portal.vercel.app/api/courses/advisor-applications',
          {
            headers : {Authorization: token},
          }
        );
        setStudentApplications(response.data);
      }catch(error){
        console.error(error);
        alert('Error fetching applications');
      }
    }
    fetchApplications();
  },[])

  const handleApproval = async (courseId,studentId,status) => {
      try{
        const token = localStorage.getItem('token');
       // console.log("i am satuus: ",status);
        await axios.post(
          'https://aims-portal.vercel.app/api/courses/advisor-approval',
          {courseId,studentId,status},
          {headers : {Authorization : token}}
        );
        alert(`Request ${status === 'advisor_approved' ? 'approved' : 'rejected'}`);
        const updatedApplications = studentApplications.filter(
          (app) => !(app.courseId === courseId && app.studentId === studentId)
        );
        setStudentApplications(updatedApplications);
      }catch (error) {
        console.error(error);
        alert('Error updating request');
      }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-transparent to-black opacity-80 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 z-50"
          >
            Logout
        </button>
        <h2 className="text-4xl font-extrabold text-gray-100 text-center mb-4">
          Faculty Advisor Dashboard
        </h2>
        <h2 className="text-4xl font-extrabold text-gray-100 text-center mb-10">
          {user}
        </h2>

        <h3 className="text-2xl font-bold text-gray-100 mb-6">Student Applications</h3>
        {studentApplications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {studentApplications.map((app) => (
              <div
                key={`${app.courseId}-${app.studentId}`}
                className="bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Course Name : {app.courseName}</h4>
                  <h4 className="text-l text-gray-500 mb-2">Course Code : {app.courseCode}</h4>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Course Instructor:</span> {app.courseInst.name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Student:</span> {app.studentName}
                  </p>
                  <p className="text-gray-600 capitalize mb-4">
                    <span className="font-semibold">Status:</span> {app.status}
                  </p>
                </div>
                {app.status === 'instructor_approved' && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleApproval(app.courseId, app.studentId, 'advisor_approved')}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(app.courseId, app.studentId, 'advisor_rejected')}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No applications available at the moment.</p>
        )}
      </div>
    </div>
  )
}

export default FacultyAdvisorDasboard
