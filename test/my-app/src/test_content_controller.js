import { defaults, create } from 'axios';
var FormData = require('form-data');

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
    return api.post(`/content/paginate/?page=1&limit=1`,{
        contentType : contentType,
        query : query
    })
}

export const wrong_getContentPage = (contentType) =>{
    return api.post(`/content/paginate/?page=1&limit=1`,{
        contentType : contentType
    })
}

export const getContentById = (contentType,contentID) =>{
    return api.post(`/content/id`,{
        contentType : contentType,
        contentID : contentID
    })
}

export const wrong_getContentById = (contentType) =>{
    return api.post(`/content/id`,{
        contentType : contentType
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
    var bodyFormData = new FormData();
    bodyFormData.append('contentType', contentType);
    bodyFormData.append('contentID', contentID);
    bodyFormData.append('thumbnail', thumbnail);
    return api.post(`/content/thumbnail`,bodyFormData,{headers:{'Content-Type': 'multipart/form-data',}}
    )
}

export const wrong_uploadThumbnaill = (contentID,thumbnail) => {
    var bodyFormData = new FormData();
    bodyFormData.append('contentID', contentID);
    bodyFormData.append('thumbnail', thumbnail);
    return api.post(`/content/thumbnail`,bodyFormData,{headers:{'Content-Type': 'multipart/form-data',}}
    )
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

export const wrong_updateContent = (title,description,contentID,subcontentIDs,published,tags) => {
    return api.put(`/content`,{
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

export const wrong_uploadComment = (contentID,action,comment) =>{
    return api.put(`/content/comment`,{
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

export const wrong_takeoffContent = (contentID) =>{
    return api.put(`/content/takeoff`,{
        contentID : contentID
    })
}


export const createsubcontent = (parentID,subcontentType,title,body) =>{
    return api.post(`/subcontent`,{
        parentID : parentID,
        subcontentType : subcontentType,
        title : title,
        body : body
    })
}

export const addView = (contentType,contentID) =>{
    return api.put(`/content/view`,{
        contentType : contentType,
        contentID : contentID
    })
}

export const wrong_addView = (contentID) =>{
    return api.put(`/content/view`,{
        contentID : contentID
    })
}

export const deleteContent = (contentType,contentID) =>{
    return api.delete(`/content`,{ data: { contentType : contentType,contentID : contentID }});
}

export const wrong_deleteContent = (contentID) =>{
    return api.delete(`/content`,{
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
var storytype="story";
var comictitle="test comic";
var storytitle="test story";
var comicdescription="test comic";
var storydescription="test story";
var tag=["Action"];
var subcontentType="page";
var pagetitle="test page";


export async function initlize(){
    try{
        await registerUser(createrusername,password,password,createremail,answer);
        console.log("succesfully registered creater");
        await registerUser(adminusername,password,password,adminemail,answer);
        console.log("succesfully registered admin");
        await registerUser(viewerusername,password,password,vieweremail,answer);
        console.log("succesfully registered viewer");
        console.log("succesfully initlized user, please don't forget to manuelly change the admin user to admin before continue \n");
    }
    catch(error){
        console.log("initlize failed, please make sure data base is cleared of entry from previous test\n");
    }
}

export async function continuetest(File){
    try{
        var response = await logIn(createrusername,password);
        var comicid=response.data.user.ownComics;
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        await uploadThumbnaill(comictype,comicid[0],File);
        console.log("uploadThumbnail sucess");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await wrong_uploadThumbnaill(comicid[0],File);
        console.log(response.data);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response = await uploadThumbnaill(comictype,"123456789101112131415161718",File);
        console.log(response.data);
        console.log("non exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("non exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("non exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await uploadThumbnaill(comictype,comicid[0],File);
        console.log(response.data);
        console.log("non owner test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("non owner test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("non owner test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await uploadThumbnaill(comictype,comicid[0],File);
        console.log(response.data);
        console.log("unauthroized test fail")
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized test fail, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-------------------Testing /updatecontent ----------------------- \n");
    try{
        var response = await logIn(createrusername,password);
        var comicid=response.data.user.ownComics;
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await createsubcontent(comicid[0],subcontentType, pagetitle, {});
        var page1=response.data.subcontent._id;
        console.log("sucessfully created sub content for"+comicid[0]);
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await createsubcontent(comicid[1],subcontentType, pagetitle, {});
        var page2=response.data.subcontent._id;
        console.log("sucessfully created sub content for"+comicid[1]);
    }
    catch(err){
        console.log(err);
    }
    try{
        await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[0],[page1],true,tag);
        console.log("sucessfully updated content");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await wrong_updateContent(comictitle+"999",comicdescription+"999",comicid[0],[page1],false,tag);
        console.log(response.data);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[0],[page2],true,tag);
        console.log("failed sub content does not belong");
    }
    catch(err){
        if(err.response.status==400){
            console.log("sub content does not belong test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("sub content does not belong test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[0],["123456789101112131415161718"],true,tag);
        console.log("failed sub content does not belong");
    }
    catch(err){
        if(err.response.status==400){
            console.log("sub content does not exist sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("sub content does not exist fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[0],[page1],true,tag);
        console.log("failed already published");
    }
    catch(err){
        if(err.response.status==400){
            console.log("already published sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("already published fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[1],[page1],true,tag);
        console.log(response.data);
        console.log("unauthroized test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not belong user test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not belong user test failt, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await updateContent(comictype,comictitle+"999",comicdescription+"999",comicid[1],[page1],true,tag);
        console.log("unauthroized test belong user test fail");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized user test failt, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-------------------Testing /comment ----------------------- \n");
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await uploadComment(comictype,comicid[0],"comment","test comment");
        console.log("sucessful comment");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await wrong_uploadComment(comicid[0],"comment","test comment");
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response = await uploadComment(comictype,comicid[1],"comment","test comment");
        console.log("unpublished test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("unpublished test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("unpublished test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response = await uploadComment(comictype,"123456789101112131415161718","comment","test comment");
        console.log("does not exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await uploadComment(comictype,comicid[0],"comment","test comment");
        console.log("unauthroized test belong user test fail");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized user test failt, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-------------------Testing /view ----------------------- \n");
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await addView(comictype,comicid[0]);
        console.log("sucess add view");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await wrong_addView(comicid[0]);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response=await addView(comictype,comicid[1]);
        console.log("not published test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("not published test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("not published test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response=await addView(comictype,"123456789101112131415161718");
        console.log("does not exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await addView(comictype,comicid[0]);
        console.log("unauthroized test belong user test fail");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized user test failt, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-------------------Testing /takeoff ----------------------- \n");
    try{
        var response = await logIn(adminusername,password);
        console.log("log in as admin");
    }
    catch(err){
        console.log(err);
    }
    try{
        await takeoffContent(comictype,comicid[0]);
        console.log("sucessfully took off")
    }
    catch(err){
        console.log(err);
    }


    try{
        var response=await wrong_takeoffContent(comicid[0]);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response=await takeoffContent(comictype,comicid[1]);
        console.log("not published test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("not published test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("not published test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response=await takeoffContent(comictype,"123456789101112131415161718");
        console.log("does not exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of admin")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await takeoffContent(comictype,comicid[1]);
        console.log("non_admin test belong user test fail");
    }
    catch(err){
        if(err.response.status==400){
            console.log("non_admin test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("non_admin  test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await takeoffContent(comictype,comicid[1]);
        console.log("unauthroized test belong user test fail");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized user test failt, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-------------------Testing /delete ----------------------- \n");
    try{
        var response = await logIn(createrusername,password);
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        await deleteContent(comictype,comicid[1]);
        console.log("sucessfully delete")
    }
    catch(err){
        console.log(err);
    }


    try{
        var response=await wrong_deleteContent(comicid[2]);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }

    try{
        var response=await deleteContent(comictype,"123456789101112131415161718");
        console.log("does not exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await deleteContent(comictype,comicid[2]);
        console.log("does not belong test belong user test fail");
    }
    catch(err){
        if(err.response.status==400){
            console.log("does not belong test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("does not belong  test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await deleteContent(comictype,comicid[2]);
        console.log("unauthroized test belong user test fail");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized user test failt, expected code 401, get:"+err.response.status);
        }
    }
}

export async function test_content(){
    console.log("preaping test");
    try{
        await logIn(createrusername,password);
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(comictype,comictitle+"0",comicdescription,tag);
        console.log("create test comic 0");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(comictype,comictitle+"1",comicdescription,tag);
        console.log("create test comic 1");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(comictype,comictitle+"2",comicdescription,tag);
        console.log("create test comic 2");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(storytype,storytitle+"0",storydescription,tag);
        console.log("create test story 0");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(storytype,storytitle+"1",storydescription,tag);
        console.log("create test story 1");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(storytype,storytitle+"2",storydescription,tag);
        console.log("create test story 2");
    }
    catch(err){
        console.log(err);
    }
    console.log("-----------------------Testing /paginate--------------------------- \n")
    try{
        var response=await getContentPage(comictype,{});
        console.log(response.data);
        console.log("sucess getContentPage");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await wrong_getContentPage(comictype);
        console.log(response.data);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await getContentPage(comictype,{"published":false});
        console.log(response.data);
        console.log("failed unauthroized");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized test fail, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-----------------------Testing /id--------------------------- \n");
    try{
        var response = await logIn(createrusername,password);
        var comicid=response.data.user.ownComics;
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await getContentById(comictype,comicid[0]);
        console.log(response.data);
        console.log("sucess get content by id");
    }
    catch(err){
        console.log(err);
        console.log("failed get content by id");
    }
    try{
        var response=await wrong_getContentById(comictype);
        console.log(response.data);
        console.log("wrong schema test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("wrong schema test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("wrong schema test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        var response = await getContentById(comictype,"123456789101112131415161718");
        console.log(response.data);
        console.log("non exist test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("non exist test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("non exist test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await logIn(viewerusername,password);
        console.log("log in as viewer");
    }
    catch(err){
        console.log(err);
    }
    try{
        var response = await getContentById(comictype,comicid[0]);
        console.log(response.data);
        console.log("non publish test fail")
    }
    catch(err){
        if(err.response.status==400){
            console.log("non publish test sucess, expected code 400, get:"+err.response.status);
        }
        else{
            console.log("non publish test fail, expected code 400, get:"+err.response.status);
        }
    }
    try{
        await logOut();
        console.log("log out of viewer")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await getContentById(comictype,comicid[0]);
        console.log(response.data);
        console.log("failed unauthroized");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized test fail, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-----------------------Testing /   --------------------------- \n");
    try{
        var response = await logIn(createrusername,password);
        var comicid=response.data.user.ownComics;
        console.log("log in as creater");
    }
    catch(err){
        console.log(err);
    }
    try{
        await createNewContent(comictype,comictitle+"999",comicdescription,tag);
        console.log("sucess createNewContent");
    }
    catch(err){
        console.log(err);
        console.log("failed createNewContent");
    }
    try{
        await logOut();
        console.log("log out of creater")
    }
    catch(err){
        console.log(err);
    }
    try{
        var response=await createNewContent(comictype,comictitle+"999",comicdescription,tag);
        console.log(response.data);
        console.log("failed createNewContent");
    }
    catch(err){
        if(err.response.status==401){
            console.log("unauthroized test sucess, expected code 401, get:"+err.response.status);
        }
        else{
            console.log("unauthroized test fail, expected code 401, get:"+err.response.status);
        }
    }
    console.log("-----------------------Testing /thumbnail   --------------------------- \n");
    console.log("waiting for file selection..........................");
}