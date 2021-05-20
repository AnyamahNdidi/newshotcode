const express = require("express")
const testRoute = express.Router()
const checkAccess = require('./privateRoute')

testRoute.post("/show", checkAccess, async (req, res, next) => {
  res.status(201).json({
    status: "Okay",
    mgs: "Finally you got it Right...!",
    mgs1: "Welcome Back...!",
  })
})

module.exports = testRoute;