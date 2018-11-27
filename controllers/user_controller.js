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
    getOne(req, res, next) {
      const params = { username: req.params.username}
      session.run('MATCH(u:user { username: $username}) RETURN u', params)
        .then((result) => {
          res.status(201).json(result);
        })
    },
    create(req, res, next) {
      //TODO: hash password
      const params = { username: req.body.username, password: req.body.password}
      if(params.username === undefined || params.password === undefined) {
        res.status(409).json("Please enter a Username & Password");
      }
      session.run('MATCH(u:user { username: $username}) RETURN u', params)
        .then((result) => {
          if(result.records[0] === null || result.records[0] === undefined){
            //TODO: Clean up with custom function
            session      
            .run('CREATE (u:user {username: $username, password: $password}) RETURN u', params)
            .then((result) => {
              res.status(201).json("User successfully created!");
            })
          } else {
            console.log("User already exists")
            res.status(409).json("Username is already taken");
          }
        })
        .catch(next);
    },   
    updatePassword(req, res, next) {

    },
    delete(req, res, next) {

    }
};