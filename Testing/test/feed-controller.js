const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed controller', function () {

    before(function(done) {
        mongoose
        .connect(process.env.MONGODB_URI_TEST)
        .then(result => {
            const user = new User({
                name:"Tester",
                email: "test@test.com",
                password: "password",
                posts: [],
                _id: '61e74529b3fbcc5b35ca9667'
            });
            return user.save();
        }).then(()=>{
            done();
        });
    });

    beforeEach(function () {});

    afterEach(function () {});

    it('should add a created post to posts of the creator', function(done){
        const req = {
            body: {
                title: "Test Post",
                content: "Test Content"
            },
            file: {
                path: 'abc'
            },
            userId: '61e74529b3fbcc5b35ca9667'

        };
        const res = {
            status: function() {
                return this;
            }, 
            json: function() {}
        };
        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            }).then(()=>{
                done();
            });
    });
})