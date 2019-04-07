const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const {
    session,
    neo4j
} = require('../../neodb');
const app = require('../../app');

const username = "User Test User";
const password = "8080751807";
const updatedPassword = "3642403665";

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

// describe("Assesment of all friendship requirements", () => {
//     it("Adding a new friendship", (done) => {
//         //For this test we assume that two users; Harry & Peter already exist in the database.
//         chai.request(app)
//             .post('/api/friendships')
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 username: 'Harry',
//                 friendName: 'Peter'
//             })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 done();
//             });
//     });
//     it("Adding the same friendship does not cause an error", (done) => {
//         chai.request(app)
//             .post('/api/friendships')
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 username: 'Harry',
//                 friendName: 'Peter'
//             })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 done();
//             });
//     });
//     it("Removal of a friendship requires two correct usernames", (done) => {
//         chai.request(app)
//             .delete('/api/friendships')
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 username: 'Harry',
//                 friendName: 'Peter'
//             })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 done();
//             });
//     });
//     it("Removal of non-existing friendship does not cause an error", (done) => {
//         chai.request(app)
//             .delete('/api/friendships')
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 username: 'Harry',
//                 friendName: 'Peter'
//             })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 done();
//             });
//     });
// });