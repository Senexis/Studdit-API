const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const app = require('../../app');

let threadId;

const username = "Thread Test User";
const password = "9216517133";
const nonExistingUsername = "Thread Test User X";

const title = "Thread Test Title";
const updatedTitle = "Thread Test Title 2";
const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu rutrum risus.";
const updatedContentTemplate = "Edit: Test.";
const updatedContent = content + " " + updatedContentTemplate;
const commentContent = "Very nice!";

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
                res.body.should.be.a('array');
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

                // Checking for proper content in first element of thread list
                res.body.should.have.any.keys(0, '_id');
                res.body.should.have.any.keys(0, 'username');
                res.body.should.have.any.keys(0, 'title');
                res.body.should.have.any.keys(0, 'content');
                res.body.should.have.any.keys(0, 'upvotesCount');
                res.body.should.have.any.keys(0, 'downvotesCount');
                res.body.should.have.any.keys(0, 'comments');

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

                res.body.should.have.any.keys(0, '_id');
                res.body.should.have.any.keys(0, 'comments')
                res.body.should.have.any.keys(0, 0, 'username');
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
    it('should require an existing user when upvoting a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/upvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: nonExistingUsername,
            })
            .end(function (err, res) {
                res.should.have.status(422)
                done()
            })
    })
    it('should add an upvote on a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/upvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                chai.expect(res.body.upvotesCount).to.equal(1)
                chai.expect(res.body.downvotesCount).to.equal(0)
                done()
            })
    })
    it('should ignore a duplicate upvote on a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/upvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                chai.expect(res.body.upvotesCount).to.equal(1)
                chai.expect(res.body.downvotesCount).to.equal(0)
                done()
            })
    })
    it('should change an upvote into a downvote on a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/downvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                chai.expect(res.body.upvotesCount).to.equal(0)
                chai.expect(res.body.downvotesCount).to.equal(1)
                done()
            })
    })
    it('should ignore a duplicate downvote on a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/downvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                chai.expect(res.body.upvotesCount).to.equal(0)
                chai.expect(res.body.downvotesCount).to.equal(1)
                done()
            })
    })
    it('should add a reply on a thread', function (done) {
        chai.request(app)
            .post('/api/threads/' + threadId + '/comments')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                content: commentContent,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.contain(commentContent)
                done()
            })
    })
    it('should get replies on a thread, including created one', function (done) {
        chai.request(app)
            .get('/api/threads/' + threadId + '/comments')
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.contain(commentContent)
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
