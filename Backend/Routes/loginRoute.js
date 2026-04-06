const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loginRoute = express.Router()
const User = require('../Models/loginModel')


loginRoute.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    })

    res.status(201).json({ message: "Registered successfully" })

  } catch (error) {
    res.status(500).json(error)
  }
})


loginRoute.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body

    const user = await User.findOne({ username, role })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      role: user.role
    })

  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = loginRoute
