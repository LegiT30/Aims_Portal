import React from "react"
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import StudentDashboard from "./Components/StudentDashboard"
import CourseInstDasboard from "./Components/CourseInstDasboard"
import FacultyAdvisorDasboard from "./Components/FacultyAdvisorDasboard"
import PrivateRoute from "./utils/PrivateRoute"
import { Navigate } from "react-router-dom"

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={
                      <PrivateRoute>
                        <StudentDashboard />
                      </PrivateRoute>
                  } 
                />
        <Route path="/instructor-dashboard" element={
                      <PrivateRoute>
                        <CourseInstDasboard />
                      </PrivateRoute>
                  } 
                />
        <Route path="/advisor-dashboard" element={
                      <PrivateRoute>
                        <FacultyAdvisorDasboard />
                      </PrivateRoute>
                  } 
                />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
