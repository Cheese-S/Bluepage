const express = require('express');
const auth = require('./auth');
const validator = require('./middleware/validate')
const UserController = require('./controller/user.controller')
const ContentController = require('./controller/content.controller')
const SubcontentController = require('./controller/subcontent.controller')
const upload = require('./middleware/multer'); 


function routes(app) {

    /* ------------------------------- UITL ROUTE ------------------------------- */
    app.get("/healthcheck", (req, res) => res.sendStatus(200));
    app.get("/query-test", (req, res) => res.status(200).send({ ...req.query }));

    /* -------------------------------- USER API -------------------------------- */
    app.post("/api/users", validator('registerUser'), UserController.registerUser);

    app.get("/api/users", auth.verify, UserController.getUser);
    
    app.put("/api/users/password", validator('changeUserPwd'), UserController.changePassword);


    app.put("/api/users/followUser", auth.verify, validator('followUser'), UserController.followUser);

    app.put("/api/users/followContent", auth.verify, validator('followContent'), UserController.followContent);

    app.put("/api/users/voteOnContent", auth.verify, validator('voteOnContent'), UserController.voteOnContent);

    app.put("/api/users/voteOnSubcontent", auth.verify, validator('voteOnSubcontent'), UserController.voteOnSubcontent);

    app.post("/api/users/login", validator('loginUser'), UserController.loginUser)

    app.post("/api/users/logout", UserController.logoutUser)

    /* ------------------------------- CONTENT API ------------------------------ */
    app.post("/api/content", auth.verify, validator('createContent'), ContentController.createContent)

    app.post("/api/content/thumbnail", auth.verify, upload.single('thumbnail'), validator('setContentThumbnail'), ContentController.setContentThumbnail)

    app.put("/api/content", auth.verify, validator('updateContent'), ContentController.updateContent)

    app.put("/api/content/view", validator('viewContent'), ContentController.viewContent)
    
    app.put("/api/content/comment", auth.verify, validator('commentContent'), ContentController.commentContent),

    app.put("/api/content/takeoff", auth.verify, UserController.isUserAdmin, validator('takeOffContent'), ContentController.takeOffContent)

    app.delete("/api/content", auth.verify, validator('deleteContent'), ContentController.deleteContent)

    app.get("/api/content/id", validator('getContentByID'), ContentController.getContentByID);


    /* ----------------------------- SUBCONTENT API ----------------------------- */
    app.post("/api/subcontent", auth.verify, validator('createSubcontent'), SubcontentController.createSubcontent)

    app.put("/api/subcontent", auth.verify, validator('updateSubcontent'), SubcontentController.updateSubcontent)

    app.put("/api/subcontent/comment", auth.verify, validator('commentSubcontent'), SubcontentController.commentSubcontent)

    app.put("/api/subcontent/view", auth.verify, validator('viewSubcontent'), SubcontentController.viewSubcontent)

    app.get("/api/subcontent/id", validator('getSubcontentByID'), SubcontentController.getSubcontentByID)

    app.delete("/api/subcontent", auth.verify, validator('deleteSubcontent'), SubcontentController.deleteSubcontent)

    app.put("/api/subcontent/publish", auth.verify, validator('publishSubcontents'), SubcontentController.publishSubcontents)

    app.put("/api/subcontent/takeoff", auth.verify, validator('takeOffSubcontent'), SubcontentController.takeOffSubcontent)

    
}

module.exports = routes