const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken")
const env = require("dotenv")
env.config()

const SECRET = process.env.SECRET_TOKEN

const auth = async (req, res, next) => {
  const token = req.header("checker")
  if (!token) {
    res.status(404).send("Access Denied")
  }
  try {
    const verified = await jwt.verify(token, SECRET)
    req.user = verified
    next()
  } catch (err) {
    console.log(err)
  }
};

module.exports = auth;