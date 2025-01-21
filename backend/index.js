const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const body_parser = require('body-parser');

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(body_parser.json());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDb connected`))
    .catch((err) => console.log('Connection err :',err));

/////connect routes here
////
////
const authRoutes = require('./Routes/auth');
const courseRoutes = require('./Routes/courses');

app.use('/api/auth',authRoutes);
app.use('/api/courses',courseRoutes);

/////remember

const PORT = process.env.PORT || 8081;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port : ${PORT}`)
});

