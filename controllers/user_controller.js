const { session, neo4j } = require('../neodb');

module.exports ={
    index(req, res, next) {
        session
        .run('MERGE (alice:Person {name : {nameParam} }) RETURN alice.name AS name', {nameParam: 'Alice'})
        .subscribe({
          onNext: function (record) {
            console.log(record.get('name'));
            res.status(200).json("Query succeeded");
          },
          onCompleted: function () {
            session.close();
          },
          onError: function (error) {
            console.log(error);
          }
        })
    },

};