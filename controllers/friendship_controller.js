const {
    session,
    neo4j
} = require('../neodb');

module.exports = {
    create(req, res, next) {
        const params = {
            username: req.body.username,
            friendName: req.body.friendName
        }
        if (params.username === undefined || params.friendName === undefined) {
            res.status(409).json("Please enter your username and a friend's name");
        }
        session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) return u', params)
            .then((result) => {
                if (!result.records[0]) {
                    console.log("username or friend does not exist");
                    res.status(409).json("username does not exist");
                } else {
                    session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) MERGE (u)-[:Friends]-(f)', params)
                        .then((result) => {
                            res.status(201).json("Relationship successfully created!");
                        })
                }
            })
            .catch(next);
    },

    delete(req, res, next) {
        const params = {
            username: req.body.username,
            friendName: req.body.friendName
        }
        console.log(params)
        if (params.username === undefined || params.friendName === undefined) {
            res.status(409).json("Please enter your username and a friend's name");
        }
        session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) return u', params)
            .then((result) => {
                if (!result.records[0]) {
                    console.log("username or friend does not exist");
                    res.status(409).json("username does not exist");
                } else {
                    session.run('MATCH (u:user {username: $username})-[r:Friends]-(:user {username: $friendName}) DELETE r', params)
                    .then(() => {
                        res.status(201).json("Relationship removed")
                    }).catch(next);
                }
            }).catch(next)
        }
};