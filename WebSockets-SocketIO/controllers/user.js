const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if(!user){
      const error = new Error('Could not find User Status');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
        message: 'Fetched Status successfully!',
        status: user.status,
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
    const status = req.body.status;
    try {
      const user = await User.findById(req.userId);
      if(!user){
        const error = new Error('Could not find User');
        error.statusCode = 404;
        throw error;
      }
      user.status = status;
      const updatedUser = await user.save();
      res.status(200).json({
        message: 'Status Updated successfully!',
        status: updatedUser.status
      });
    } catch (err) {
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
    }
  };