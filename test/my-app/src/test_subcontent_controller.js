import { defaults, create } from 'axios';

defaults.withCredentials = true;
const api = create({
    baseURL: `http://localhost:4000/api`,
})

export const registerUser = (name,passwrod,passwordConfirmation,email,answer) =>{
    return api.post(`/users`,{
        name: name,
        password: passwrod,
        passwordConfirmation: passwordConfirmation,
        email: email,
        answers: answer
    })
}

export const logIn = (nameOrEmail,password) =>{
    return api.post(`/users/login`,{
        nameOrEmail: nameOrEmail,
        password: password
    })
}

export const logOut = () =>{
    return api.post(`/users/logout`,{
    })
}

export const getContentById = (contentType,contentID) =>{
    return api.post(`/content/id`,{
        contentType : contentType,
        contentID : contentID
    })
}
export const getSubcontentByID = (subcontentID, subcontentType) => {
    return api.post(`/subcontent/id`, {
        subcontentID : subcontentID,
        subcontentType: subcontentType
    })
}

export const createNewContent = (contentType,title,description,tags) => {
    return api.post(`/content`,{
        contentType : contentType,
        title : title,
        description : description,
        tags : tags
    })
}
export const createNewSubContent = (contentID, SubContentType, title, body) => {
    return api.post(`/subcontent`, {
        parentID: contentID,
        subcontentType: SubContentType, 
        title: title, 
        body: body
    })
}

export const updateContent = (title, description, tags, published, contentID, type, subcontent) => {
    return api.put(`/content`, {
        title: title, 
        description: description,
        tags: tags,
        published: published, 
        contentID, contentID, 
        contentType: type,
        subcontentIDs :subcontent
    })
}
export const updateSubContent = (subcontentType, subcontentID, title, body, publshed, parentID) =>  {
    return api.put(`/subcontent`, {
        subcontentType: subcontentType,
        subcontentID: subcontentID, 
        title: title, 
        body: body,
        published: publshed,
        parentID: parentID
    })
}
 export const putComment = (action, subcontentID, subcontentType, comment, commentID) => {
     return api.put(`/subcontent/comment`, {
         action: action,
         subcontentID: subcontentID, 
         subcontentType: subcontentType, 
         comment: comment,
         commentID: commentID
     })
 }
export const addView = (subcontentType, contentID) => {
    return api.put(`/subcontent/view`, {
        subcontentType: subcontentType, 
        subcontentID: contentID
    })
}
export const publishSubContent = (subcontentType, subcontentID, contentID) => {
    return api.put(`/subcontent/publish`, {
        subcontentType: subcontentType, 
        subcontentIDs: subcontentID,
        parentID: contentID
    })
}
export const deleteSubcontent = (subcontentType, subcontentID) => {
    return api.delete(`/subcontent`, {
        subcontentType: subcontentType, 
        subcontentID: subcontentID
    })
}
export const takeOffContent = (subcontentType, subcontentID) => {
    return api.put('/subcontent/takeoff', {
        subcontentType: subcontentType,
        subcontentID: subcontentID
    })
}
var createrusername = 'create';
var createremail = 'create@create.com';
var adminusername = 'admin';
var adminemail = 'admin@admin.com';
var password = '12345678';
var answer = ["Shanghai", "NewYork", "USA"];
var comictype = "comic";
var storytype = "story";
var pagetype = "page";
var chaptertype = "chapter";
var comictitle = "test comic";
var pagetitle = "test page";
var storytitle = "test story";
var chaptertitle = "test chapter";
var comicdescription = "test comic";
var storydescription = "test story";
var pagedescription = "test page";
var chapterdescription = "test chapter";
var action = "comment";
var subaction = "subcomment";
var tag=["Action"]; 

export async function initSubContentUsers(){
    try{
        await registerUser(createrusername,password,password,createremail,answer);
        console.log("Successfully registered Creator");
        await registerUser(adminusername,password,password,adminemail,answer);
        console.log("Successfully registed Admin");
        console.log("Successfully registered all users \n");
    }
    catch(error){
        console.log("Initializing Users failed, Make sure the database is empty\n");
    }
}

export async function test_subcontent(){
    console.log("Subcontent test START");
    try{
        await logIn(adminusername, password);
        await logIn(createrusername,password);
        console.log("LogIn as Creator");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(comictype,comictitle+"0",comicdescription,tag);
        console.log("Create test comic 0");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(storytype,storytitle+"0",storydescription,tag);
        console.log("Create test story 0");
    }
    catch(err){
        console.log(err);
    }
    try{
        await logOut();
        console.log("LogOut of Creator")
    }
    catch(err){
        console.log(err);
    }
    try{
        
        var response = await logIn(createrusername,password);
        var comicid = response.data.user.ownComics;    
        var storyid = response.data.user.ownStories;
        console.log("LogIn as Creator");
    }
    catch(err){
        console.log(err);
    }
    try{
        await logOut();
        console.log("LogOut of Creator")
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewSubContent(comicid[0],pagetype,pagetitle+"0",pagedescription);
        console.log("Unauthorized New Subcontent test failure, Expected Code: 401, Actual Code: 200");
    }
    catch(err){
        if(err.response.status==401){
            console.log("Unauthorized New Subcontent test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else{
            console.log("Unauthorized New Subcontent test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try{
        await logIn(createrusername,password);
        var comicid=response.data.user.ownComics;    
        console.log("LogIn as Creator");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewSubContent(pagetype,pagetitle+"0");
        console.log("Bad Request New Subcontent test failure, Expected Code: 401, Actual Code: 200");
    }
    catch(err){
        if(err.response.status==400){
            console.log("Bad Request New Subcontent test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else{
            console.log("Bad Request New Subcontent test failure, Expected Code: 400, Actual Code : "+err.response.status);
        }
    }   
    try{
        var response = await createNewSubContent(comicid[0], pagetype, pagetitle + "0", {});
        var page0 = response.data.subcontent._id;
        console.log("A Page 0 has been created for comic 0, Code: 200");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response1 = await getSubcontentByID(pagetype);
        console.log("Bad Request Get Subcontent failure, Expected Code: 400, Actual Code: 200");
    }
    catch(err) {
        if (err.response.status==400){
            console.log("Bad Request Get Subcontent test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Get Subcontent test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try{
        var response1 = await getSubcontentByID(page0, pagetype);
        console.log("Obtained page 0");
    }
    catch(err) {
        console.log("Failed to get page 0")
    }
    try {
        var x = [page0];
        var response = await updateContent(comictitle, comictitle + "0", tag, true, comicid[0], comictype, x);
        console.log("Published Comic 0, along with Page 0");
    }
    catch (err) {
        console.log(err);
    }
    try{
        var response = await createNewSubContent(comicid[0], pagetype, pagetitle + "2", {});
        var page1 = response.data.subcontent._id;
        console.log("A Page 1 has been created for comic 0, Code: 200");
    }
    catch(err){
        console.log(err);
    }
    try {
        var truth = Boolean(10 > 9);
        var response = await updateSubContent(pagetype, page1, pagetitle+"2", {}, truth, comicid[0]);
        console.log("Updated and published Page 1 of Comic 0");
        var page0 = response.data.subcontent._id;
    }
    catch(err) {
        console.log(err);
    }
    try {
        var truth = Boolean(10 < 9);
        await updateSubContent(pagetype, page1, pagetitle+"1", {}, truth, 2);
        console.log("Bad Request Update Subcontent test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Update Subcontent test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Update Subcontent test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try {
        var comment = "OMG Cool Comic";
        var response = await putComment(action, page0, pagetype, comment, "aaaaaaaaaaaaaaaaaaaaaaaa");
        var comment0 = response.data.subcontent.comments[0]._id;
        console.log("On page 0 of comic, a comment was added.");
    }
    catch (err) {
        console.log(err);
    }
    try {
        var comment = "No way man!";
       await putComment(subaction, page0, pagetype, comment, comment0);
       console.log("On page 0 of comic, a comment was added to comment: "+ comment0);
    }
    catch (err) {
        console.log(err);
    }
    try {
        var comment = "OMG BAD Comic";
        var response = await putComment(action, "aaaaaaaaaaaaaaaaaaaaaaaa", pagetype, comment, "aaaaaaaaaaaaaaaaaaaaaaaa");
        console.log("Bad Request Add Comment test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Add Comment test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Add Comment test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try {
        var comment = "Yea way!";
        var response = await putComment(subaction, page0, pagetype, comment, "aaaaaaaaaaaaaaaaaaaaaaaa");
        console.log("Bad Request Add Subcomment test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Add Subcomment test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Add Subomment test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try {
        await addView(pagetype, page0);
        console.log("Successfully added view to page0");
    }
    catch(err){
        console.log(err);
    }
    try {
        await addView(pagetype, comment0);
        console.log("Successfully added view to page0");
        console.log("Bad Request Add View test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Add View test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Add View test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try{
        var response = await createNewSubContent(comicid[0], pagetype, pagetitle + "3", {});
        var page2 = response.data.subcontent._id;
        console.log("A Page 2 has been created for Comic 0, Code: 200");
    }
    catch(err){
        console.log(err);
    }
    try{
        var subcontentID = [page2]
        var response = await publishSubContent(pagetype, subcontentID, comicid[0]);
        console.log("Page 2 was published for Comic 0");
    }
    catch(err){
        console.log(err);
    }
    try{
        var subcontenID = [page0]
        var response = await publishSubContent(pagetype, subcontenID, comicid[0]);
        console.log("Bad Request Publish Subcontent test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Publish Subcontent test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Publish Subcontent test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try{
        var response = await createNewSubContent(storyid[0], chaptertype, chaptertitle + "0", {});
        var chapter0 = response.data.subcontent._id;
        console.log("A Chapter 0 has been created for Story 0, Code: 200");
    }
    catch(err){
        console.log(err);
    }
    try {
        var response = await deleteSubcontent(chaptertype, chapter0);
        console.log("Deleted Chapter 0 from the database");
    }
    catch (err) {
        console.log("Deleted Chapter 0 from the database");
    }
    try {
        var response = await deleteSubcontent(pagetype, "aaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log("Bad Request Delete Subcontent test failure, Expected Code: 400, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==400){
            console.log("Bad Request Delete Subcontent test success, Expected Code: 400, Actual Code: "+err.response.status);
        }
        else {
            console.log("Bad Request Delete Subcontent test failure, Expected Code: 400, Actual Code: "+err.response.status);
        }
    }
    try {
        await logOut();
        console.log("LogOut of Creator")
    }
    catch(err){
        console.log(err);
    }
    try {
        var truth = Boolean(10 > 9);
        var response = await updateSubContent(pagetype, page1, pagetitle+"2", {}, truth, comicid[0]);
        console.log("Unauthorized Update Subcontent test failure, Expected Code: 401, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==401){
            console.log("Unauthorized Update Subcontent test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else {
            console.log("Unauthorized Update Subcontent test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try {
        var comment = "OMG Cool Comic";
        var response = await putComment(action, page0, pagetype, comment, "aaaaaaaaaaaaaaaaaaaaaaaa");
        console.log("Unauthorized Add Comment test failure, Expected Code: 401, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==401){
            console.log("Unauthorized Add Comment test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else {
            console.log("Unauthorized Add Comment test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try {
        await addView(pagetype, page0);
        console.log("Unauthorized Add View test failure, Expected Code: 401, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==401){
            console.log("Unauthorized Add View test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else {
            console.log("Unauthorized Add View test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try {
        var response = await deleteSubcontent(pagetype, "aaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log("Unauthorized Delete Subcontent test failure, Expected Code: 401, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==401){
            console.log("Unauthorized Delete Subcontent test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else {
            console.log("Unauthorized Delete Subcontent test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try {
        await takeOffContent(pagetype, page0);
        console.log("Unauthorized Take Off Subcontent test failure, Expected Code: 401, Actual Code: 200");
    }
    catch (err) {
        if (err.response.status==401){
            console.log("Unauthorized Take Off Subcontent test success, Expected Code: 401, Actual Code: "+err.response.status);
        }
        else {
            console.log("Unauthorized Take Off Subcontent test failure, Expected Code: 401, Actual Code: "+err.response.status);
        }
    }
    try {
        await logIn(adminusername, password);
        console.log("Logged in as Admin");
    }
    catch(err) {
        console.log(err);
    }
    try {
        var response = await takeOffContent(pagetype, "aaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(response);
        console.log("Bad Request Take Off Subcontent test failure, Expected Code: 400, Actual: 200");
    }
    catch (err) {
        console.log(err);
        if (err.response.status == 400) {
            console.log("Bad Request Take Off Subcontent test success, Expected Code: 400, Actual Code: "+ err.response.status);
        }
        else {
            console.log("Bad Request Take Off Subcontent test failure, Expected Code: 400, Actual Code: "+ err.response.status);
        }
    }
    try {
        await takeOffContent(pagetype, page0);
        console.log("Page 0 taken off");
    }
    catch (err) {
        console.log(err);
    }
    try {
        await logOut();
        console.log("Admin logged off");
    }
    catch (err){
        console.log(err);
    }
}