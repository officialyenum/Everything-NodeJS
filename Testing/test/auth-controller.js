const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - Login', function () {

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

    beforeEach(function () {
        
    });

    afterEach(function () {
        
    });

    it('should throw an error if accessing database fails', function(done){
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        const req = {
            body: {
                email: "test@test.com",
                password: "password"
            }
        }
        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode',500 );
            done();
        });
        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function (done) { 
        const req = {userId: '61e74529b3fbcc5b35ca9667'}
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => {}).then(()=>{
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
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