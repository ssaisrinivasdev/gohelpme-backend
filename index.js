const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// ...

app.use(express.urlencoded({
    extended: true
  }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(express.json())
app.use(cookieParser())


const connectionString = process.env['CONNECTION_STRING']
//MongoDB Connection

mongoose.connect(connectionString)
.then(()=>{
    console.log("Connected to DB")
})
.catch((error)=>{
    console.log(error)
})

//Import the routes
const userRoutes = require('./routes/user');
const fundRoutes = require('./routes/fund');
const donationRouters = require('./routes/donation');
const dashboardRouters = require('./routes/dashboard');
const blogPost = require('./routes/blog')
const withdrawl = require('./routes/withdrawl')
const query = require('./routes/query')
const admin = require('./routes/admin')
const charity = require('./routes/charity')

// Using routes
app.use('/api', userRoutes);
app.use('/api', fundRoutes);
app.use('/api', donationRouters);
app.use('/api', dashboardRouters);
app.use('/api', blogPost);
app.use('/api/withdrawl', withdrawl);
app.use('/api/query', query);
app.use('/api/admin', admin);
app.use('/api', charity);

app.get('/',(req,res)=>{
    console.log("Working");
    res.send("working");
})

app.listen(process.env['PORT'], () => {
	console.log('Server started on '+process.env['PORT'])
})