"use strict";
const SingleFile = require("../models/singlefile");
const MultipleFile = require("../models/multiplefile");
const bcrypt = require('bcrypt')
const { signup } = require("../Validation/Validation");
const joi = require('@hapi/joi')
const { required } = require('@hapi/joi')
const jwt = require("jsonwebtoken")
const env = require("dotenv")
env.config()
const SECRET = process.env.SECRET_TOKEN


const schema = joi.object({

  fullname: joi.string().required(),
  location: joi.string().required(),
  salary: joi.string().required(),
  subject: joi.string().required(),
  phoneNumber: joi.string().required(),
  exprience: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().min(3).required(),

})

const singleFileUpload = async (req, res, next) => {
  try {
    const file = new SingleFile({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
    });
    await file.save();
    res.status(201).send("File Uploaded Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//for the registration

const multipleFileUpload = async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body)
    console.log(error)
    if (error) {
      return res.status(404).send(error.details[0].message)

    }

    const salted = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salted)
    let filesArray = [];
    req.files.forEach((element) => {
      const file = {
        fileName: element.originalname,
        filePath: element.path,
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2),
      };
      filesArray.push(file);
    });

    const emailChecker = await MultipleFile.findOne({ email: req.body.email })
    if (emailChecker) {
      return res.status(404).send("email aready exits ")

    }

    const multipleFiles = new MultipleFile({
      fullname: req.body.fullname,
      location: req.body.location,
      salary: req.body.salary,
      subject: req.body.subject,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      exprience: req.body.exprience,
      password: hashedPassword,
      files: filesArray,

    });
    await multipleFiles.save();
    res.status(201).send("Files Uploaded Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//for the login

async function signIn(req, res) {
  try {
    const user = await MultipleFile.findOne({
      email: req.body.email
    })
    if (!user) {
      res.status(404).send("Email does not exit")
    }
    const checkPassword = await bcrypt.compare(req.body.password, user.password)
    if (!checkPassword) {
      res.status(404).send("Password is invalid")
    }
    const checker = await jwt.sign({ _id: user._id }, SECRET)

    res.header("auth-token", checker).json({
      token: checker,
      mgs: "Welcome back"
    })

  } catch (error) {
    res.status(400).send(error.message);
  }
}

//for the delete
const deleteDetails = async (req, res) => {
  const newData = await MultipleFile.findByIdAndDelete(req.params.id);
  res.status(200).send("Deleted");
}


//for the edit

const updateDetails = async (req, res) => {
  const newData = await MultipleFile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
}

const getallSingleFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};



const getallMultipleFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

module.exports = {
  singleFileUpload,
  multipleFileUpload,
  getallSingleFiles,
  getallMultipleFiles,
  signIn,
  deleteDetails,
  updateDetails
};
