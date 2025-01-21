const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    courseCode:{
        type: String,
        required: true,
        unique: true
    },
    instructor:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    students:[
        {
            student:{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            status:{ 
                type: String, 
                enum: ['pending', 'instructor_approved', 'advisor_approved', 'enrolled','instructor_rejected','advisor_rejected'], 
                default: 'pending' 
            },
        },
    ],
});

module.exports = mongoose.model('Course',CourseSchema);