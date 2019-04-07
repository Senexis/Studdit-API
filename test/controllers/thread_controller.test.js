const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const {
    session,
    neo4j
} = require('../../neodb');
const app = require('../../app');

const Thread = require('../../models/thread');

let threadId;
const username = "Thread Test User";
const password = "9216517133";
const nonExistingUsername = "Thread Test User X";

const title = "Thread Test Title";
const updatedTitle = "Thread Test Title 2";
const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu rutrum risus.";
const updatedContentTemplate = "Edit: Test.";
const updatedContent = content + " " + updatedContentTemplate;

chai.use(chaiHttp)
describe('Thread API interface', () => {
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
                        res.text.should.contain(username)
                        done();
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
                done();
            })
    })

    it('should get all threads', function (done) {
        chai.request(app)
            .get('/api/threads')
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('array')
                done()
            })
    })
    it('should create a thread', function (done) {
        chai.request(app)
            .post('/api/threads')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                title: title,
                content: content
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('_id');
                threadId = res.body._id;
                done()
            })
    })
    it('should require an existing user when creating a thread', function (done) {
        chai.request(app)
            .post('/api/threads')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: nonExistingUsername,
                title: title,
                content: content
            })
            .end(function (err, res) {
                res.should.have.status(422)
                done()
            })
    })
    it('should get all threads, including created one', function (done) {
        chai.request(app)
            .get('/api/threads')
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.text.should.contain(title)
                res.text.should.contain(content)
                done()
            })
    })
    it('should get specific thread', function (done) {
        chai.request(app)
            .get('/api/threads/' + threadId)
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.contain(title)
                res.text.should.contain(content)
                done()
            })
    })
    it('should update a thread', function (done) {
        chai.request(app)
            .put('/api/threads/' + threadId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                content: updatedContent
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.contain(updatedContentTemplate)
                done()
            })
    })
    it('should ignore an update to a thread\'s title', function (done) {
        chai.request(app)
            .put('/api/threads/' + threadId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                title: updatedTitle
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.not.contain(updatedTitle)
                res.text.should.contain(title)
                done()
            })
    })
    it('should delete a thread', function (done) {
        chai.request(app)
            .delete('/api/threads/' + threadId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    })
})