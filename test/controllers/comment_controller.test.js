const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const app = require('../../app');

let threadId;
let commentId;

const username = "Comment Test User";
const password = "9216517133";
const nonExistingUsername = "Comment Test User X";

const title = "Comment Test Title";
const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu rutrum risus.";
const updatedContentTemplate = "Edit: Test.";
const updatedContent = content + " " + updatedContentTemplate;
const commentContent = "Very nice!";
const updatedCommentContentTemplate = "Edit: Test.";
const updatedCommentContent = commentContent + " " + updatedCommentContentTemplate;

chai.use(chaiHttp)
describe('Comment API interface', () => {
    before(function (done) {
        // Since we are doing >1 request, increase the timeout.
        this.timeout(10000);

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
                                        commentId = res.body._id;

                                        done()
                                    })
                            })
                    })
            })
    })
    after(function (done) {
        // Since we are doing >1 request, increase the timeout.
        this.timeout(10000);

        chai.request(app)
            .delete('/api/threads/' + threadId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(204);

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
    })

    it('should get a specific comment', function (done) {
        chai.request(app)
            .get('/api/comments/' + commentId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.text.should.contain(username)
                res.text.should.contain(commentContent)
                done()
            })
    })
    it('should update a comment', function (done) {
        chai.request(app)
            .put('/api/comments/' + commentId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                content: updatedCommentContent
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.text.should.contain(updatedCommentContentTemplate)
                done()
            })
    })

    it('should create a reply', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/comments')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: username,
                content: content
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.property('_id');
                replyId = res.body._id;
                done()
            })
    })
    it('should require an existing user when creating a reply', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/comments')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: nonExistingUsername,
                content: content
            })
            .end(function (err, res) {
                res.should.have.status(422);
                done()
            })
    })
    it('should get all replies, including created one', function (done) {
        chai.request(app)
            .get('/api/comments/' + commentId + '/comments')
            .end(function (err, res) {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.text.should.contain(content)
                done()
            })
    })
    it('should update a comment', function (done) {
        chai.request(app)
            .put('/api/comments/' + commentId)
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
    it('should require an existing user when upvoting a comment', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/upvotes')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: nonExistingUsername,
            })
            .end(function (err, res) {
                res.should.have.status(422)
                done()
            })
    })
    it('should add an upvote on a comment', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/upvotes')
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
    it('should ignore a duplicate upvote on a comment', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/upvotes')
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
    it('should change an upvote into a downvote on a comment', function (done) {
        chai.request(app)
        .post('/api/comments/' + commentId + '/downvotes')
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
    it('should ignore a duplicate downvote on a comment', function (done) {
        chai.request(app)
            .post('/api/comments/' + commentId + '/downvotes')
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
    it('should delete a comment', function (done) {
        chai.request(app)
            .delete('/api/comments/' + commentId)
            .set('content-type', 'application/x-www-form-urlencoded')
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            })
    })
})