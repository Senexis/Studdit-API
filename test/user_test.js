const assert = require('assert');
const User = require('../models/user');

describe("Assesment of all user requirements", () => {
    const _userid;
    it("Creation of user requires username and password", (done) => {

    });
    it("Creation of user requires unique username", (done) => {

    });
    it("Update of password requires a correct current password", (done) => {

    });
    it("Update that has error returns 401", (done) => {

    });
    it("Removal of a user requires correct username and password", (done) => {

    });
    it("Threads and comments of removed user still exist", (done) => {

    });
    it("Delete that has error returns 401", (done) => {

    });
});

describe("Assesment of all friendship requirements", () => {
    it("Adding a new friendship", (done) => {

    });
    it("Adding the same friendship does not cause an error", (done) => {

    });
    it("Removal of a friendship requires two correct usernames", (done) => {

    });
    it("Removal of non-existing friendship does not cause an error", (done) => {

    });
});