const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  console.log(currentPage);
  const perPage = 2;
  // let totalItems;
  try {
    const totalItems = await Post.find().count();
    const posts = await Post.find().populate("creator").skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({
      message: 'Posts Fetched successfully!',
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    //If Yes, it's an invalid ObjectId, throw error.
    const error = new Error('Could not find Post, Invalid post Identifier');
    error.statusCode = 404;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if(!post){
      const error = new Error('Could not find Post');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Post Fetched successfully!',
      post: post
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  console.log("======creating post========")
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if(!req.file){
    const error = new Error('Validation failed, Image not provided');
    error.statusCode = 422;
    throw error;
  }
  console.log(req.file.path);
  // Create post in db
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path,
    creator: req.userId
  })
  try {
    const savedPost = await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const savedUser = await user.save();
    res.status(201).json({
      message: 'Post created successfully!',
      post: savedPost,
      creator: {
        _id: savedUser._id,
        name: savedUser.name
      }
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
  


};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    //If Yes, it's an invalid ObjectId, throw error.
    const error = new Error('Could not find Post, Invalid post Identifier');
    error.statusCode = 404;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file){
    imageUrl = req.file.path
  }
  if(!imageUrl){
    const error = new Error('No file Picked');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if(!post){
      const error = new Error('Could not find Post');
      error.statusCode = 404;
      throw error;
    }
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl != post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const updatedPost = await post.save();
    res.status(200).json({
      message: 'Post Updated successfully!',
      post: updatedPost
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
    //If Yes, it's an invalid ObjectId, throw error.
    const error = new Error('Could not find Post, Invalid post Identifier');
    error.statusCode = 404;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if(!post){
      const error = new Error('Could not find Post');
      error.statusCode = 404;
      throw error;
    }
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }
    // Checked Logged in user
    clearImage(post.imageUrl);
    const deletedPost = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const savedUser = await user.save();
    res.status(200).json({
      message: 'Post Deleted successfully!',
    });
  } catch (err) {
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err);
  }
};


const clearImage = filePath => {
  filePath = path.join(__dirname, "../"+filePath);
  fs.unlink(filePath, err => { console.log(err)});
}