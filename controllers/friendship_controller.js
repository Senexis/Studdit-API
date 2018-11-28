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
        console.log(params)
        if (params.username === undefined || params.friendName === undefined) {
            res.status(409).json("Please enter your username and a friend's name");
        }
        //TODO: Clean this up
        session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) return u', params)
            .then((result) => {

                if (!result.records[0]) {
                    console.log("username or friend does not exist");
                    res.status(409).json("username does not exist");
                } else {
                    //A relationship always has a direction. We can create a relationship both ways however.
                    session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) CREATE (u)-[:Friendship]-> (f)', params)
                        .then((result) => {

                            session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) CREATE (f)-[:Friendship]-> (u)', params)
                                .then((result) => {
                                    res.status(201).json("Relationship successfully created!");
                                })

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
        //TODO: catch typo or wrong name
        session.run('MATCH (u:user {username: $username})-[r:Friendship]-(:user {username: $friendName}) DELETE r', params)
            .then(() => {
                res.status(201).json("Relationship removed")
            }).catch(next);
    }
};