
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function StudentDashboard() {

    const [availableCourses,setAvailableCourses] = useState([]);
    const [appliedCourses,setAppliedCourses] = useState([]);
    const [user,setUser] = useState([]);

    useEffect(() => {
        const fectchCourses = async () => {
            try{
                const token = localStorage.getItem('token');
                const getUser = localStorage.getItem('name');
                setUser(getUser);

                const availableResponse = await axios.get(
                    'https://aims-portal.vercel.app/api/courses/available',
                    {
                        headers: {Authorization: token},
                    }
                );
                //console.log("i am avail",availableResponse.data);
                setAvailableCourses(availableResponse.data);

                const appliedResponse = await axios.get(
                    'https://aims-portal.vercel.app/api/courses/student-applications',
                    {
                        headers: {Authorization: token},
                    }
                );
              
                setAppliedCourses(appliedResponse.data);
            }catch(error){
                console.error(error);
                alert('Error fetching courses 111');
            }
        }
        fectchCourses();
    },[]);

    const handleApply = async (courseId) => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://aims-portal.vercel.app/api/courses/apply',
                {courseId},
                {headers : {Authorization: token}}
            );
            //console.log(response.data.message);
            alert('Applied successfully');

            const appliedResponse = await axios.get(
                'https://aims-portal.vercel.app/api/courses/student-applications',
                {
                    headers: {Authorization : token}
                }
            );
            
            setAppliedCourses(appliedResponse.data);  
        }catch(error){
            console.error(error); 
            //console.log(error);
            alert('Already applied to this course.');
        }
    }

    const handleDropCourse = async (courseId) => {
        try{
          //console.log(courseId);
          const token = localStorage.getItem('token');
          await axios.post(
            'https://aims-portal.vercel.app/api/courses/drop',
            {courseId},
            {headers : {Authorization : token}}
          )
          alert('Course dropped successfully');
          const appliedResponse = await axios.get(
              'https://aims-portal.vercel.app/api/courses/student-applications',
              {
                  headers: {Authorization : token}
              }
          );
          
          setAppliedCourses(appliedResponse.data);  
        }catch (error) {
          console.error(error);
          alert('Error dropping course');
        }
    }

    const handleLogout = () => {
      localStorage.clear();
      window.location.href = '/'; 
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-transparent to-black opacity-80 py-10">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 z-50"
      >
        Logout
      </button>

      <div className="relative z-10 p-6 sm:p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-200 text-center mb-4">Student Dashboard</h1>
        <h1 className="text-4xl font-bold text-gray-200 text-center mb-8">{user}</h1>

        <section className="mb-12 bg-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Applied Courses</h2>
          {appliedCourses.length === 0 ? (
            <p className="text-gray-500">You have not applied for any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appliedCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="p-4 bg-gray-200 rounded-lg shadow-md border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{course.courseName}</h3>
                  <h3 className="text-l font-semibold text-gray-500">Course Code : {course.courseCode}</h3>
                  <h3 className="text-l font-semibold text-gray-500">Course Instructor : {course.courseInst}</h3>
                  <p className="text-sm text-black mt-1">
                    Status: <span className="font-medium capitalize mb-1">{course.status}</span>
                  </p>
                  {course.status === 'enrolled' && (
                    <button
                      onClick={() => handleDropCourse(course.courseId)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300 mt-1"
                    >
                      Drop
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-gray-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Courses</h2>
          {availableCourses.length === 0 ? (
            <p className="text-gray-500">No courses available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableCourses.map((course) => (
                <div
                  key={course._id}
                  className="p-4 bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                  <h3 className="text-l  font-semibold text-gray-500">Course Code : {course.courseCode}</h3>
                  <h3 className="text-l  font-semibold text-gray-500">Instructor : {course.instructor.name}</h3>
                  <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleApply(course._id)}
                  >
                    Apply for Course
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default StudentDashboard
