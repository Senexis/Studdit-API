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

chai.use(chaiHttp);

describe('Assessment of thread requirements', () => {
    it('should get all threads using /api/threads/', () => {
        chai.request(app)
            .get('/api/threads/')
            .end((err, res) => {
                res.should.have.status(201);
                // TODO.

                done();
            });
    });
    it('should get a thread using /api/threads/:id/', () => {
        const NewThread = {
            username: "Test1",
            title: "Test1 Title",
            content: "Test1 Content"
        }

        Thread.create(NewThread)
            .then(thread => {
                chai.request(app)
                    .get(`/api/threads/${thread.id}/`)
                    .end((err, res) => {
                        res.should.have.status(201);
        
                        // TODO.
        
                        done();
                    });
            })
            .catch()

    });
});