const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// generate jsonwebtoken TOKEN for authentication
const generateToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// @desc - Register a new User
// @route - POST - /api/users
// @access - PUBLIC
const registerUser = asyncHandler(async(req, res) => {
  const { name, email, password } = req.body
  // check if name/email/password are entered in body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }
  // Check if another user with that Email already exists
  const userExists = await User.findOne({email})
  if(userExists) {
    res.status(400)
    throw new Error('User with Email already exists')
  }
  // create new User with password hashed
  const salt = await bcrypt.genSaltSync(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error ('Invalid user data')
  }
})

// @desc - Login a User
// @route - POST - /api/users/login
// @access - PUBLIC
const loginUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  // checks if that user's email exists and if password is correct
  if(user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials provided')
  }
})


// @desc - Get current user information
// @route - GET - /api/users/me
// @access - PRIVATE
const getMe = asyncHandler(async(req, res) => {
  // console.log('CHECK THIS', req.user)
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  }
  res.status(200).json(user)
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
