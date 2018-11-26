const { session, neo4j } = require('../neodb');

module.exports ={
    index(req, res, next) {
        var node = db.nodes({name: 'Bob'}).label(['Person']);

        console.log(node.get());
    },

};