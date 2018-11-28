const { session, neo4j } = require('../neodb');

module.exports = {
    index(req, res, next) {
        session.run('MATCH(u) RETURN u')
            .then(result => res.send(result.records))
            .catch(next);
    },

    create(req, res, next) {
        //TODO: hash password
        const params = {
            username: req.body.username,
            password: req.body.password
        }

        if (params.username === undefined || params.password === undefined) {
            res.status(409).json("Please enter a Username & Password");
        }
        
        session.run('MATCH(u:user { username: $username}) RETURN u', params)
            .then((result) => {
                if (!result.records[0]) {
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

    read(req, res, next) {
        const params = { username: req.params.username }

        session.run('MATCH(u:user { username: $username}) RETURN u', params)
            .then(result => res.send(result.records))
            .catch(next);
    },

    //TODO: Fix this; password is able to change even when pwd does not match
    edit(req, res, next) {
        const params = {
            username: req.params.username,
            password: req.body.password,
            newPassword: req.body.newPassword
        }
        console.log(params);
        if (params.username === undefined || params.password === undefined || params.newPassword === undefined) {
            res.status(409).json("Please enter all required fields");
        }
        session.run('MATCH(u:user { username: $username, password: $password}) SET u.password = $newPassword RETURN u', params)
            .then((result) => {
                console.log("Success")
                res.status(201).json("Password succesfully updated");
            })
            .catch(next);
    },

    //TODO: Fix expected paramters error 
    delete(req, res, next) {
        const params = { username: req.params.username }

        session.run('MATCH(u:user { username: $username }) DETACH DELETE u')
            .then(result => res.status(204).send(result))
            .catch(next);
    }
};