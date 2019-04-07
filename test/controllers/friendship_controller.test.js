const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const app = require('../../app');

const username = "Friend Test User 1";
const password = "9216517133";
const friendUsername = "Friend Test User 2";
const friendPassword = "7450433751";
const nonExistingUsername = "Friend Test User X";

chai.use(chaiHttp)
describe("Friendship API interface", () => {
    before(function (done) {
        chai.request(app)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                password: password
            })
            .end(function (err, res) {
                chai.request(app)
                    .get('/api/users/' + username)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('username');
                        res.text.should.contain(username);

                        chai.request(app)
                            .post('/api/users')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .send({
                                username: friendUsername,
                                password: friendPassword
                            })
                            .end(function (err, res) {
                                chai.request(app)
                                    .get('/api/users/' + friendUsername)
                                    .set('content-type', 'application/x-www-form-urlencoded')
                                    .end(function (err, res) {
                                        res.should.have.status(200);
                                        res.body.should.have.property('username');
                                        res.text.should.contain(friendUsername)
                                        done();
                                    })
                            })
                    })
            })
    })
    after(function (done) {
        chai.request(app)
            .delete('/api/users/' + username)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                password: password
            })
            .end(function (err, res) {
                res.should.have.status(204);

                chai.request(app)
                    .delete('/api/users/' + friendUsername)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({
                        password: friendPassword
                    })
                    .end(function (err, res) {
                        res.should.have.status(204);
                        done();
                    })
            })
    })

    it("should not allow a new friendship with a non-existing user", (done) => {
        chai.request(app)
            .post('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                friendName: nonExistingUsername
            })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
    it("should create a friendship", (done) => {
        chai.request(app)
            .post('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                friendName: friendUsername
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it("should allow duplicate friendships", (done) => {
        chai.request(app)
            .post('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                friendName: friendUsername
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it("should remove a friendship", (done) => {
        chai.request(app)
            .delete('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                friendName: friendUsername
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it("should allow removal of non-existing friendships", (done) => {
        chai.request(app)
            .delete('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                friendName: friendUsername
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
});