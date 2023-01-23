const express = require('express')
const dotenv = require('dotenv').config()

const PORT = process.env.PORT
const { errorHandler } = require('./src/middleware/errorMiddleware')
const connectDB = require('./src/config/db')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
connectDB()

// Proof of Life checking API retrieval
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Welcome to Tray Ticker Page' })
// })

// User Routes: registerUser, loginUser, getMe
app.use('/api/users', require('./src/routes/userRoutes'))
app.use('/api/tickets', require('./src/routes/ticketRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log('Server Up and running on port: ', PORT))
