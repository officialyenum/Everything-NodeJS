const User = require('../models/user');
const Post = require('../models/post')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const { clearImage } = require('../util/file');

module.exports = {
    createUser: async function({userInput}, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)){
            errors.push({message: "E-mail is invalid. "});
        }

        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password,{min:5})){
            errors.push({message: "Password too short. "});
        }

        if(errors.length > 0){
          const error = new Error('Invalid Input');
          error.code = 422;
          error.data = errors;
          throw error;
        }
        
        const existingUser = await User.findOne({email:userInput.email});
        if (existingUser){
            const error = new Error("User Exists already");
            throw error;
        } 
        const hashedPass = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            name: userInput.name,
            email: userInput.email,
            password: hashedPass,
            status: "I am New!",
        })
        const savedUser = await user.save();
        console.log(savedUser);
        return { ...savedUser._doc, _id: savedUser._id.toString()};
    },
    login: async function({ email, password }, req) {
        const user = await User.findOne({email: email});
        if (!user){
            const error = new Error('A user with this email could not be found');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error = new Error('Incorrect Password');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email, 
            userId: user._id.toString()
        }, process.env.TOKEN_SECRET, {expiresIn: "24h"});

        return {
            token: token,
            userId: user._id.toString()
        };
    },
    createPost: async function({postInput}, req) {
        console.log("auth :"+req.auth);
        console.log("is auth :"+req.isAuth);
        if(!req.isAuth){
          const error = new Error('Not Authenticated. ');
          error.code = 401;
          throw error;
        }
        const errors = [];
        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title,{min: 5})){
            errors.push({message: "Title is invalid. "});
        }

        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content,{min:5})){
            errors.push({message: "Content is invalid. "});
        }

        if(errors.length > 0){
          const error = new Error('Invalid Input. ');
          error.code = 422;
          error.data = errors;
          throw error;
        }
        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error('Invalid User. ');
            error.code = 401;
            throw error;
        }
        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: user
        });
        const savedPost = await post.save();
        user.posts.push(savedPost);
        await user.save();
        return {
            ...savedPost._doc,
            _id: savedPost._id.toString(),
            createdAt: savedPost.createdAt.toISOString(),
            updatedAt: savedPost.updatedAt.toISOString(),
        }
        
    },
    posts: async function({page}, req) {
        if (!req.isAuth) {
          const error = new Error('Not authenticated!');
          error.code = 401;
          throw error;
        }

        const currentPage = page || 1;
        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .populate("creator");
        return {
          posts: posts.map(p => {
            return {
              ...p._doc,
              _id: p._id.toString(),
              createdAt: p.createdAt.toISOString(),
              updatedAt: p.updatedAt.toISOString()
            };
          }),
          totalPosts: totalPosts
        };
    },
    post: async function({ id }, req) {
        if (!req.isAuth) {
          const error = new Error('Not authenticated!');
          error.code = 401;
          throw error;
        }
        const post = await Post.findById(id).populate('creator');
        if (!post) {
          const error = new Error('No post found!');
          error.code = 404;
          throw error;
        }
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString()
        };
    },

  updatePost: async function({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== 'undefined') {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };
  },
  deletePost: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(id);
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  updateStatus: async function({ status }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  }
}