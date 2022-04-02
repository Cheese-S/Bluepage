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

export const followUser = (followingUserID,action) =>{
    return api.put(`/users/followUser`,{
        followingUserID : followingUserID,
        action : action
    })
}

export const followContent = (contentType,contentID,action) =>{
    return api.put(`/users/followUser`,{
        contentType : contentType,
        contentID : contentID,
        action : action
    })
}

export const getContentPage = (contentType,query) =>{
    return api.get(`/content/?page=1&limit=1`,{
        contentType : contentType,
        query : query
    })
}

export const getContentById = (contentType,contentID) =>{
    return api.get(`/content/ ${contentID}`,{
        contentType : contentType,
        contentID : contentID
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

export const uploadThumbnaill = (contentType,contentID,thumbnail) => {
    return api.post(`/content/thumbnail`,{
        contentType : contentType,
        contentID : contentID,
        thumbnail : thumbnail
    })
}

export const updateContent = (contentType,title,description,contentID,subcontentIDs,published,tags) => {
    return api.put(`/content`,{
        contentType: contentType,
        title: title,
        description: description,
        contentID: contentID,
        subcontentIDs: subcontentIDs, 
        published: published,
        tags : tags
    })
}

export const uploadComment = (contentType,contentID,action,comment) =>{
    return api.put(`/content/comment`,{
        contentType : contentType,
        contentID : contentID,
        action : action,
        comment : comment
    })
}

export const takeoffContent = (contentType,contentID) =>{
    return api.put(`/content/takeoff`,{
        contentType : contentType,
        contentID : contentID
    })
}

export const addView = (contentType,contentID) =>{
    return api.put(`/content/view`,{
        contentType : contentType,
        contentID : contentID
    })
}

export const deleteContent = (contentType,contentID) =>{
    return api.delete(`/content`,{
        contentType : contentType,
        contentID : contentID
    })
}

var createrusername = 'create';
var createremail = 'create@create.com';
var adminusername = 'admin';
var adminemail = 'admin@admin.com';
var viewerusername = 'viewer';
var vieweremail = 'viewer@viewer.com';
var password = '12345678';
var answer = ["SHanghai", "NewYork","USA"];
var comictype="comic";
var comictitle="test comic";
var comicdescription="test comic";
var comcictag=["Action"];

export async function initlize(){
    try{
        await registerUser(createrusername,password,password,createremail,answer);
        console.log("succesfully registered creater");
        await registerUser(adminusername,password,password,adminemail,answer);
        console.log("succesfully registered admin");
        await registerUser(viewerusername,password,password,vieweremail,answer);
        console.log("succesfully registered viewer");
        await logIn(createrusername,password);
        console.log("succesfully initlized user, logged in as creater, please manuelly change the admin user to admin");
    }
    catch(error){
        console.log("initlize failed, please make sure data base is cleared of entry from previous test\n");
    }
}
