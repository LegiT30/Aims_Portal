import React from "react"
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Login from "./Components/Login"
import Dashboard from "./Components/Dashboard"
import Addcourse from "./Components/Addcourse"
import Signup from "./Components/Signup"
import StudentDashboard from "./Components/StudentDashboard"
import CourseInstDasboard from "./Components/CourseInstDasboard"
import FacultyAdvisorDasboard from "./Components/FacultyAdvisorDasboard"

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-course" element={<Addcourse />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/instructor-dashboard" element={<CourseInstDasboard />} />
        <Route path="/advisor-dashboard" element={<FacultyAdvisorDasboard />} />
      </Routes>
    </Router>
  )
}

export default App
