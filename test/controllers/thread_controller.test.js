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
    it('should get all threads using /api/threads/', (done) => {
        chai.request(app)
            .get('/api/threads/')
            .end((err, res) => {
                if(err) {
                    console.log(err);
                    done(err)
                } else {
                    //We assume that items have been added; perhaps add these in the test
                    res.should.have.status(200);
                    //Check if body is not empty
                    should.exist(res.body); //Check for null & not defined
                    //Check if body contains more than one item (to check if multiple threads can be obtained)
                    expect(res.body).to.have.length.above(1)
                    console.log(res.body)
                    done();

                }
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
                        //console.log(res)
                        res.should.have.status(201);
        
                        // TODO.
        
                        done();
                    });
            })
            .catch()

    });
});