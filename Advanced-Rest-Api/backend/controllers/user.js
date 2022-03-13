const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
        console.log(user)
        if(!user){
            const error = new Error('Could not find User Status');
            error.statusCode = 404;
            throw error;
        }
        console.log(user.status);
        res.status(200).json({
            message: 'Fetched Status successfully!',
            status: user.status,
        });
    }).catch(err => {
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
    });
};

exports.updateStatus = (req, res, next) => {
    const status = req.body.status;
    User.findById(req.userId)
      .then((user) => {
        if(!user){
          const error = new Error('Could not find User');
          error.statusCode = 404;
          throw error;
        }
        user.status = status;
        return user.save();
      })
      .then((result) => {
        console.log(result.status);
        res.status(200).json({
          message: 'Status Updated successfully!',
          status: result.status
        });
      })
      .catch((err) => {
        if(!err.statusCode){
          err.statusCode = 500
        }
        next(err);
      });
  };