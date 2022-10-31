const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();

app.use(cors())
app.use(express.json())


const connection = "mongodb+srv://"+process.env['MONGO_DB_USERNAME']+":"+process.env['MONGO_DB_PASSWORD']
                    +"@gohelpme-node-backend.le2kcot.mongodb.net/GoFundMe"
//MongoDB Connection
console.log(connection)
mongoose.connect(connection)
.then(()=>{
    console.log("Connected to DB")
})
.catch(()=>{
    console.log("Unable to connect to DB")
})

//Import the routes
const userRoutes = require("./routes/user")

// Using routes
app.use('/api', userRoutes) 



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
	console.log('Server started on 3000')
})