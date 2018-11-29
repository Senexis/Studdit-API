const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect();
const {
    session,
    neo4j
} = require('../neodb');
const app = require('../app');

let name = "Hect0r";
let pwd = "secretPassword";
let newPwd = "notSoSecretPassword";

chai.use(chaiHttp);

describe("Assesment of all user requirements", () => {
    // it("Creation of user requires username and password", (done) => {
    //     //Posting without contents gives an error
    //     chai.request(app).post('/api/users')
    //         .end((err, res) => {
    //             res.should.have.status(409);
    //             res.body.should.contain("Please enter a Username & Password")
    //          done();
    //         })   
    // });
    it("Creation of user works when all fields provided", (done) => {
        chai.request(app)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({username: name, password: pwd})
            .end((err, res) => {
                  res.should.have.status(201);
              done();
        });
    });
    it("Creation of user requires unique username", (done) => {
            chai.request(app)
                .post('/api/users')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({username: name, password: pwd})
                .end((err, res) => {
                      res.should.have.status(401);
                  done();
            });
    });
    it("Update of password requires a correct current password", (done) => {
        chai.request(app)
            .put('/api/users/' + name)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({password: pwd, newPassword: newPwd})
            .end((err, res) => {
                res.should.have.status(201);
                pwd = newPwd;
            done();
        });
    });
    it("Update that has error returns 401", (done) => {
        chai.request(app)
            .put('/api/users/' + name)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({password: 'totallyWrongPassword', newPassword: newPwd})
            .end((err, res) => {
                res.should.have.status(401);
            done();
        });
    });
    it("Delete that has error returns 401", (done) => {
        chai.request(app)
            .delete('/api/users/' + name)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({password: 'totallyWrongPassword'})
            .end((err, res) => {
                  res.should.have.status(401);
              done();
        });
    });
    it("Delete that properly works when username and password are provided", (done) => {
        chai.request(app)
            .delete('/api/users/' + name)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({password: pwd})
            .end((err, res) => {
                  res.should.have.status(204);
              done();
        });
    });
    // it("Threads and comments of removed user still exist", (done) => {
    //     done();
    // });
});

describe("Assesment of all friendship requirements", () => {
    it("Adding a new friendship", (done) => {
        //For this test we assume that two users; Harry & Peter already exist in the database.
        chai.request(app)
            .post('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'Harry', friendName: 'Peter'})
            .end((err, res) => {
                  res.should.have.status(201);
              done();
        });
    });
    it("Adding the same friendship does not cause an error", (done) => {
        chai.request(app)
            .post('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'Harry', friendName: 'Peter'})
            .end((err, res) => {
                  res.should.have.status(201);
              done();
        });
    });
    it("Removal of a friendship requires two correct usernames", (done) => {
        chai.request(app)
            .delete('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'Harry', friendName: 'Peter'})
            .end((err, res) => {
                  res.should.have.status(201);
              done();
        });
    });
    it("Removal of non-existing friendship does not cause an error", (done) => {
        chai.request(app)
            .delete('/api/friendships')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'Harry', friendName: 'Peter'})
            .end((err, res) => {
                  res.should.have.status(201);
              done();
        });
    });
});