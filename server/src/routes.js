const express = require('express');
const auth = require('./auth');
const validator = require('./middleware/validate')
const UserController = require('./controller/user.controller')


function routes(app) {
    app.get("/healthcheck", (req, res) => res.sendStatus(200));

    app.post("/api/users", validator('registerUser'), UserController.registerUser);

    app.put("/api/users/password", validator('changeUserPwd'), UserController.changePassword);

    app.get("/api/users", auth.verify, UserController.getUser);

    app.put("/api/users/follow", auth.verify, validator('followUser'), UserController.followUser);

    app.post("/api/users/login", validator('loginUser'), UserController.loginUser)

    app.post("/api/users/logout", UserController.logoutUser)
}

module.exports = routes