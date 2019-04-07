const neo4j = require('neo4j-driver').v1; //Making sure we always have the stable version.
require('dotenv').config()

const driver = neo4j.driver(
    process.env.neo4jUrl.toString(), 
    neo4j.auth.basic(
        process.env.neo4jUsername,
        process.env.neo4jPassword
    ));
const session = driver.session(); // Define a global session here, so not every function needs to create one

module.exports = {
    neo4j,
    session
}