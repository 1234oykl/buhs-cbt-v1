const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/db')
const cors = require("cors");
const dns = require('dns')
const mongoose = require("mongoose");

dns.setServers(['1.1.1.1', '8.8.8.8'])

const resultRoutes = require('./routes/resultRoutes')
const examRoutes = require('./routes/examRoutes')
const userRoutes = require('./routes/userRoutes')
const subjectRoutes = require("./routes/subjectRoutes");


const PORT = process.env.PORT || 5000
const { errorHandler } = require('./middleware/errorMiddleware')

//connect to the database
connectDB()
const app = express()


mongoose.connection.once("open", () => {
  console.log("CONNECTED DB:", mongoose.connection.name);
});


// middleware to access request body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Enable CORS for all routes for allowwing cross-origin requests from the frontend
app.use(cors());


app.get('/', (req, res) => {
  // res.send('API is running..')
  res.status(200).json({message: 'welcome to BUHS CBT API'})
})

app.use('/api/users', userRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/results', resultRoutes)
app.use("/api/subjects", subjectRoutes);


app.use(errorHandler)



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.cyan.underline)
})
