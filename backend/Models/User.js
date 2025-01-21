const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        required: true,
        enum: ['faculty_advisor', 'course_instructor', 'student']
    },
    otp:{
        type: String
    },
    otpExpiresAt:{
        type: String
    }
});

module.exports = mongoose.model('User',UserSchema);