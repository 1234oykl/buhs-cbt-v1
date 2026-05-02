const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000


const app = express()

app.get('/', (req, res) => {
  // res.send('API is running..')
  res.status(200).json({message: 'welcome to BUHS CBT API'})
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
