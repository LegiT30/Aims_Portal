import axios from 'axios';
import React, { useEffect, useState } from 'react';

function CourseInstDashboard() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [user,setUser] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const getUser = localStorage.getItem('name');
        setUser(getUser);

        const response = await axios.get('http://localhost:8081/api/courses/instructor', {
          headers: { Authorization: token },
        });
       console.log("i am res: ",response.data);
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching courses at instructor');
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8081/api/courses/add',
        { name: newCourseName, courseCode: newCourseCode },
        { headers: { Authorization: token } }
      );
      alert('Course added successfully');
      setNewCourseName('');
      setNewCourseCode('');
      setShowAddCourseModal(false);
    } catch (error) {
      console.error(error);
      alert('Error adding course');
    }
  };

  const handleApproval = async (courseId, studentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8081/api/courses/instructor-approval',
        { courseId, studentId, status },
        { headers: { Authorization: token } }
      );
      alert(`Request ${status === 'instructor_approved' ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error(error);
      alert('Error updating request');
    }
  };

  const abc = () => {
    console.log("done done dnone"); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-transparent to-black opacity-80 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-gray-200 text-center mb-4">Instructor Dashboard</h2>
        <h2 className="text-4xl font-extrabold text-gray-200 text-center mb-10">{user}</h2>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            + Add New Course
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-gray-100 shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-bold text-black mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-4">Course Code: {course.courseCode}</p>
              <h4 className="font-semibold text-gray-900 mb-3">Applications:</h4>
              {course.students.length > 0 ? (
                <div className="space-y-3">
                  {course.students.map((student) => (
                    <div
                      key={student.student._id}
                      className="flex justify-start items-start p-3 bg-gray-200 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-900">Student Name: {student.student.name}</p>
                        <p className="text-sm text-gray-600 capitalize">Status: {student.status}</p>
                      </div>
                      {student.status === 'pending' && (
                        <div>
                          <button
                            onClick={() => handleApproval(course._id, student.student._id, 'instructor_approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition duration-300 ml-12 mb-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(course._id, student.student._id, 'instructor_rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300 ml-14"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No applications yet.</p>
              )}
            </div>
          ))}
        </div>

        {showAddCourseModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Course</h3>
              <input
                type="text"
                value={newCourseName}
                placeholder="Enter course name"
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newCourseCode}
                placeholder="Enter course code"
                onChange={(e) => setNewCourseCode(e.target.value)}
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Course
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseInstDashboard;
