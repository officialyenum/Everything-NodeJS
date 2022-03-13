const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPass = await bcrypt.hash(password, 12)
        const user = new User({
            name: name,
            email: email,
            password: hashedPass,
            status: "I am New!",
        })
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(201).json({
            message: 'User Signed Up successfully!',
            userId: savedUser._id
        });
    } catch (err) {
        if ( !err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    let loadedUser;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email});
        if (!user){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email, 
            userId: user._id.toString()
        }, process.env.TOKEN_SECRET, {expiresIn: "1h"});

        res.status(200).json({
            message: 'User Logged in successfully!',
            token: token,
            userId: user._id.toString()
        });
    } catch (err) {
        if ( !err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
}