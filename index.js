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
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.bodyParser({limit: '5mb'}));


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


// Using routes
app.use('/api', userRoutes);
app.use('/api', fundRoutes);
app.use('/api', donationRouters);



// app.post('/api/login', async (req, res) => {
// 	const user = await User.findOne({
// 		email: req.body.email,
// 	})

// 	if (!user) {
// 		return { status: 'error', error: 'Invalid login' }
// 	}

// 	const isPasswordValid = await bcrypt.compare(
// 		req.body.password,
// 		user.password
// 	)

// 	if (isPasswordValid) {
// 		const token = jwt.sign(
// 			{
// 				name: user.name,
// 				email: user.email,
// 			},
// 			'secret123'
// 		)

// 		return res.json({ status: 'ok', user: token })
// 	} else {
// 		return res.json({ status: 'error', user: false })
// 	}
// })


app.listen(process.env['PORT'], () => {
	console.log('Server started on '+process.env['PORT'])
})