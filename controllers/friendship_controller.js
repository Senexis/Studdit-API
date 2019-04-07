const { session } = require('../neodb');

module.exports = {
    create(req, res, next) {
        const params = {
            username: req.body.username,
            friendName: req.body.friendName
        }

        if (params.username === undefined || params.friendName === undefined) {
            res.status(409).json({ "error": "Username or friend's username missing." });
        }

        session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) return u', params)
            .then((result) => {
                if (!result.records[0]) {
                    res.status(409).json({ "error": "Username does not exist." });
                } else {
                    session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) MERGE (u)-[:Friends]-(f)', params)
                        .then(() => {
                            res.status(201).json({ "message": "Relationship successfully created." });
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

        if (params.username === undefined || params.friendName === undefined) {
            res.status(409).json({ "error": "Username or friend's username missing." });
        }

        session.run('MATCH (u:user {username: $username}), (f:user {username: $friendName}) return u', params)
            .then((result) => {
                if (!result.records[0]) {
                    res.status(409).json({ "error": "Username does not exist." });
                } else {
                    session.run('MATCH (u:user {username: $username})-[r:Friends]-(:user {username: $friendName}) DELETE r', params)
                        .then(() => {
                            res.status(201).json({ "message": "Relationship removed." })
                        }).catch(next);
                }
            }).catch(next)
    }
};