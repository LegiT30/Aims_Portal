const express = require('express');
const jwt = require('jsonwebtoken');
const Course = require('../Models/Course');
const User = require('../Models/User');

const router = express.Router();

const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({message : "Token required"});
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        if(err) return res.status(403).json({message : 'Invalid Token'});
        req.user = decoded;
        next();
    });
};

router.get('/getuser',verifyToken, async(req,res) => {
    //console.log(" ia sfds :", req.user);
    try{
        res.status(200).json({role : req.user.name});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
})
router.get('/available', async (req, res) => {
    try {
      const courses = await Course.find().populate('instructor', 'name');
      res.json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching available courses' });
    }
  });

router.post('/add',verifyToken,async (req,res) => {
    try{
        const {name,courseCode} = req.body;
        if(!name){
            return res.status(400).json({ message: 'Course name is required.' });
        }

        const instructorId = req.user.id;

        const newCourse = new Course({
            name,
            courseCode,
            instructor: instructorId,
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully.', course: newCourse });
    }catch(error){
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Failed to add course.' });
    }
});

router.get('/student-applications',verifyToken,async (req,res) => {
    const studentId = req.user.id;

    try{
        const courses = await Course.find({'students.student':studentId}).populate('instructor','name');
        
        const applications = courses.map((course) => {
            const studentInfo = course.students.find((s) => s.student.toString() ===studentId);
            return{
                courseId : course._id,
                courseName : course.name,
                courseCode : course.courseCode,
                courseInst : course.instructor.name,
                status : studentInfo.status,
            }
        });
        res.json(applications);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

router.post('/apply',verifyToken,async (req,res) => {
    const {courseId} =req.body;
    const studentId = req.user.id;

    try{
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const existingApplication = course.students.find((s) => s.student.toString() === studentId);
        if(existingApplication){
            return res.status(400).json({ message: 'Already applied for this course' });
        }
 
        course.students.push({student: studentId, status: 'pending'});
        await course.save();
        //console.log("Application sub at backend");
        res.json({ message: 'Application submitted' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error applying for course' });
    }
});

router.get('/instructor',verifyToken,async (req,res) => {
    try{
        const instructorId = req.user.id;
        
        const courses = await Course.find({instructor : instructorId}).populate({
            path : 'students.student',
            select : 'name'
        });
      
        res.status(200).json(courses);
    }catch(error){
        console.error('Error fetching instructor courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses.' });
    }
})

router.post('/instructor-approval',verifyToken,async(req,res) => {
    const {courseId,studentId,status} = req.body;
   // console.log(req.body);
    try{
        const course = await Course.findById(courseId);
        
        const student =  course.students.find((s) => s.student.toString() === studentId);
        if(!student){
            return res.status(404).json({message : 'Student Not found'});
        }
           
        student.status = status;
        await course.save();

        res.json({ message: 'Approval updated' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error updating approval at backend' });
    }
})

router.get('/advisor-applications',verifyToken,async (req,res) => {
    try{
        const courses = await Course.find({'students.status': 'instructor_approved'}).populate(
            {
                path : 'students.student',
                select : 'name'
            },
        ).populate(
            {
                path : 'instructor',
                select: 'name'
            }
        );
        
        const applications = [];

        courses.forEach((course) => {
            course.students.forEach((student) => {
                if(student.status === 'instructor_approved'){
                    applications.push({
                        courseId : course._id,
                        courseName: course.name,
                        courseCode: course.courseCode,
                        courseInst: course.instructor,
                        studentId: student.student._id,
                        studentName : student.student.name,
                        studentEmail: student._id,
                        status: student.status,
                    });
                }
            });
        });
        //console.log(applications);
        res.json(applications);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

router.post('/advisor-approval',verifyToken,async (req,res) => {
    const {courseId,studentId,status} = req.body;
    //console.log("i am body: ",req.body);

    try{
        const course = await Course.findById(courseId);
        const student = course.students.find((s) => s.student.toString() === studentId)
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if(status === 'advisor_approved' && student.status === 'instructor_approved') {
            student.status = 'enrolled';
        }else{
            student.status = status;
        }

        await course.save();
        res.json({ message: 'Approval updated' });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating approval' });
    }
})

router.post('/drop',verifyToken,async (req,res) => {
    const courseId = req.body.courseId;
    const studentId = req.user.id;
    //console.log("i am courseId",courseId);
    //console.log("i am studentId",studentId);

    try{
        //console.log(' iam course');
        const course = await Course.findById(courseId);
        //console.log(' iam course',course);
        const student = course.students.find((s) => s.student.toString() === studentId);
       //console.log('i am status: ',student.status);
        student.status = 'dropped';

        await course.save();
       res.status(200).send({ message: 'Course dropped successfully' });
    }catch (error) {
        res.status(500).send({ error: 'Error dropping course' });
    }
})

  
module.exports = router;