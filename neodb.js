const neo4j = require('neo4j-driver').v1; //Making sure we always have the stable version.
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));
const session = driver.session(); // Define a global session here, so not every function needs to create one

module.exports = {
    neo4j,
    session
}