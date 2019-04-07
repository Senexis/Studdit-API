const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const app = require('../../app');

const username = "User Test User";
const password = "8080751807";
const updatedPassword = "3642403665";
const incorrectPassword = "0";

chai.use(chaiHttp)
describe('User API interface', () => {
    it('should get all users', function (done) {
        chai.request(app)
            .get('/api/users')
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('array')
                done()
            })
    })
    it('should create a user', function (done) {
        chai.request(app)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                password: password
            })
            .end(function (err, res) {
                res.should.have.status(201)
                done()
            })
    })
    it('should fail to post the same user', function (done) {
        chai.request(app)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                password: password
            })
            .end(function (err, res) {
                res.should.have.status(401)
                done()
            })
    })
    it('should get a created user', function (done) {
        chai.request(app)
            .get('/api/users/' + username)
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })
    it('should fail to update a user with wrong password', function (done) {
        chai.request(app)
            .put('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                password: incorrectPassword,
                newPassword: password
            })
            .end(function (err, res) {
                res.should.have.status(401)
                done()
            })
    })
    it('should update a user', function (done) {
        chai.request(app)
            .put('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                password: password,
                newPassword: updatedPassword
            })
            .end(function (err, res) {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.text.should.contain(updatedPassword)
                done()
            })
    })
    it('should fail to delete a user with wrong password', function (done) {
        chai.request(app)
            .delete('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                password: incorrectPassword
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            })
    })
    it('should delete a user', function (done) {
        chai.request(app)
            .delete('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                password: updatedPassword
            })
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    })
    it('should fail to get a deleted user', function (done) {
        chai.request(app)
            .get('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            })
    })
})