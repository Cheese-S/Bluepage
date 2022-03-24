const express = require('express');
const validator = require('./middleware/validate')


function routes(app) {
    app.get("/healthcheck", (req, res) => res.sendStatus(200));

    app.post("/api/users", validator('registerUser'), (req, res) => res.sendStatus(200));

    app.put("/api/users/password", validator('changeUserPwd'), (req, res) => res.sendStatus(200));
}

module.exports = routes