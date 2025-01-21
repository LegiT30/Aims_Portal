const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../Models/User');


const router = express.Router();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/signup', async (req, res) => {
    const { email, role, name} = req.body;

    // Validate input
    // if (!email || !role) {
    //     return res.status(400).json({ error: 'Email and role are required' });
    // }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ name,email, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login',async(req,res) => {
    const {email} = req.body;
    console.log("i am at login user",req.user);
    console.log("i am at login body",req.body);

    try{
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const otp = generateOtp();
        console.log(`OTP generated ${otp}`);
        user.otp=otp;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await transporter.sendMail({
            from: "chunchunmaaru106@gmail.com",
            to: email,
            subject: 'Your otp for login',
            text: `Your otp is ${otp}`,
        });

        res.status(200).json({message : "Otp sent to mail"})
    }catch(error){
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});

router.post('/verify-otp', async (req,res) => {
    const {email,otp} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({ message: 'User not found' });

        if(user.otp!==otp  || user.otpExpiresAt < new Date()){
            return res.status(400).json({message : 'Invalid or Expired OTP'});
        }

        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = jwt.sign(
            { id: user._id,role: user.role },
            process.env.JWT_SECRET,
            {expiresIn : '24h'}
        );
        res.status(200).json({message : 'Login successful',token,role:user.role,name:user.name});
    }catch(err){
        res.status(500).json({message: 'Error verifying otp',err});
    }
});

module.exports = router;