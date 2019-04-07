const { session } = require('../neodb');

function getAsObjects(records) {
    return records.map(record => record.toObject({ forceJSNumbers: true }))
}

module.exports = {
    index(req, res, next) {
        session.run('MATCH(u) RETURN u.username AS username')
            .then(result => res.json(getAsObjects(result.records)))
            .catch(next);
    },

    create(req, res, next) {
        const params = {
            username: req.body.username,
            password: req.body.password
        }

        if (params.username === undefined || params.password === undefined) {
            res.status(409).json({ "error": "Please enter a username and password." });
        }

        session.run('MATCH(u:user { username: $username}) RETURN u.username AS username, u.password AS password LIMIT 1', params)
            .then((result) => {
                if (!result.records[0]) {
                    session
                        .run('CREATE (u:user {username: $username, password: $password}) RETURN u.username AS username, u.password AS password LIMIT 1', params)
                        .then(result => {
                            res.status(201).json(getAsObjects(result.records)[0]);
                        })
                } else {
                    res.status(401).json({ "error": "Username is already taken." });
                }
            })
            .catch(next);
    },

    read(req, res, next) {
        const params = {
            username: req.params.username
        }

        session.run('MATCH(u:user { username: $username}) RETURN u.username AS username, u.password AS password LIMIT 1', params)
            .then(result => {
                if (!result.records[0]) {
                    res.status(404).json({ "error": "Not found." });
                } else {
                    res.send(getAsObjects(result.records)[0]);
                }
            })
            .catch(next);
    },

    edit(req, res, next) {
        const params = {
            username: req.params.username,
            password: req.body.password,
            newPassword: req.body.newPassword
        }

        if (params.username === undefined || params.password === undefined || params.newPassword === undefined) {
            res.status(401).json({ "error": "Please enter all required fields." });
        }

        session.run('MATCH(u:user { username: $username}), (u:user {password: $password}) RETURN u.username AS username, u.password AS password LIMIT 1', params)
            .then((result) => {
                if (!result.records[0]) {
                    res.status(401).json({ "error": "Username or password is incorrect." })
                } else {
                    session.run('MATCH(u:user { username: $username}), (u:user {password: $password}) SET u.password = $newPassword RETURN u.username AS username, u.password AS password LIMIT 1', params)
                        .then(result => {
                            res.status(201).json(getAsObjects(result.records)[0]);
                        }).catch(next)
                }
            })
            .catch(next);
    },

    delete(req, res, next) {
        const params = {
            username: req.params.username,
            password: req.body.password
        }

        if (params.username === undefined || params.password === undefined) {
            res.status(401).json({ "error": "Please enter all required fields." });
        }

        session.run('MATCH(u:user { username: $username}), (u:user {password: $password}) RETURN u.username AS username, u.password AS password LIMIT 1', params)
            .then((result) => {
                if (!result.records[0]) {
                    res.status(401).json({ "error": "Username or password is incorrect." })
                } else {
                    session.run('MATCH(u:user { username: $username }) DETACH DELETE u', params)
                        .then(_ => {
                            res.status(204).json();
                        })
                        .catch(next);
                }
            }).catch(next);
    }
}; 