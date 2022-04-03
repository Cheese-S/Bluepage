import { defaults, create } from 'axios';

defaults.withCredentials = true;
const api = create({
    baseURL: `http://localhost:4000/api`,
});

export const registerUser = (username, password, passwordConfirmation, email, answers) => {
    return api.post(`/users`,{
        name: username,
        password: password,
        passwordConfirmation: passwordConfirmation,
        email: email,
        answers: answers
    });
};

export const login = (nameOrEmail, password) =>{
    return api.post(`/users/login`, {
        nameOrEmail: nameOrEmail,
        password: password
    });
};

export const logout = () => {
    return api.post(`/users/logout`, {
    });
};

export const getUser = () => {
    return api.get(`/users`, {
    });
};

export const followUser = (followingUserID, action) => {
    return api.put(`/users/followUser`, {
        followingUserID: followingUserID,
        action: action
    });
};

export const createNewContent = (contentType, title, description, tags) => {
    return api.post(`/content`, {
        contentType: contentType,
        title: title,
        description: description,
        tags: tags,
    });
};

export const publishContent = (title, description, tags, contentID, contentType, subcontentIDs) => {
    return api.put(`/content/`, {
        title,
        description,
        tags,
        published: true,
        contentID,
        contentType,
        subcontentIDs,
    });
};

export const createNewSubcontent = (parentID, subcontentType, title, body) => {
    return api.post(`/subcontent`, {
        parentID,
        subcontentType,
        title,
        body,
    });
};

export const publishSubcontent = (subcontentType, subcontentIDs, parentID) => {
    return api.put(`/subcontent/publish`, {
        subcontentType,
        subcontentIDs,
        parentID, 
    });
};

export const followContent = (contentID, contentType, action) => {
    return api.put(`users/followContent`, {
        contentID: contentID,
        contentType: contentType,
        action: action,
    });
};

export const voteOnContent = (contentType, contentID, prev, current) => {
    return api.put(`users/voteOnContent`, {
        contentType,
        contentID,
        prev,
        current, 
    });
};

export const voteOnSubcontent = (subcontentID, subcontentType, prev, current) => {
    return api.put(`users/voteOnSubcontent`, {
        subcontentID,
        subcontentType,
        prev,
        current,
    });
};

export const changePassword = (password) => {
    return api.put(`users/password`, {
        isLoggedIn: true,
        password,
        passwordConfirmation: password,
    });
};

export const changePasswordLoggedOut = (password, answers, nameOrEmail) => {
    return api.put(`users/password`, {
        isLoggedIn: false,
        password,
        passwordConfirmation: password,
        answers,
        nameOrEmail,
    });
}

const testName = 'testuser';
const testPass = 'password1';
const testEmail = 'test@user.com';
const testAnswers = ['Valley Stream', 'New York', 'USA'];
let userID;
const secondName = 'testTwoser';
const secondEmail = 'test@two.com';
const secondAnswers = ['North', 'Korea', 'South Korea'];
let secondID;
let contentID;
let subcontentID;

export async function init_users() {
    try {
        // Create two test users
        const res = await registerUser(testName, testPass, testPass, testEmail, testAnswers);
        const second = await registerUser(secondName, testPass, testPass, secondEmail, secondAnswers);

        // Log their IDs
        userID = res.data.user._id;
        secondID = second.data.user._id;

        // Logout, and log back in as the first
        await logout();
        await login(testName, testPass);

        console.log('created two users, logged in as the first');
    } catch(err) {
        console.log('failure: user creation was unsuccessful. err shown below:')
        console.log(err);
    }
    try {
        // Create content
        const contentRes = await createNewContent('comic', 'Test Comic', 'A comic for testing purposes', ['Action']);
        contentID = contentRes.data.content._id;
        console.log('content created');

        // Create subcontent for that comic
        const subRes = await createNewSubcontent(contentID, 'page', 'Test - Page 1', {});
        subcontentID = subRes.data.subcontent._id;
        console.log('subcontent created');
    } catch(err) {
        console.log('failure: content/subcontent creation was unsuccessful. err shown below:')
        console.log(err);
    }
    try {
        // Publish that content with that subcontent
        await publishContent('Test Comic', 'A comic for testing purposes', ['Action'], contentID, 'comic', [subcontentID]);
        console.log('content published with subcontent');
    } catch(err) {
        console.log('failure: content publishing was unsuccessful. err shown below:');
        console.log(err);
    }
}

export async function current_test() {
    /** Change Password test */
    try {
        // change password while logged in
        const res = await changePassword('password2');
        console.log(`success: changed password. expected 200, response was ${res.status}`); 
    } catch(err) {
        console.log('failure: did not change password. err shown below:');
        console.log(err);
    }
    try {
        // log out
        await logout();

        // bad change password request
        const res = await changePasswordLoggedOut('password2', ['no', 'fake', 'answers'], testName);
        console.log(`failure: changed password with wrong answers. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('success: did not change password. err shown below:');
        console.log(err);
    }
    try {
        // change password while logged out
        const res = await changePasswordLoggedOut('password3', testAnswers, testName);
        console.log(`success: changed password while logged out. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('failure: did not change password. err shown below:');
        console.log(err);
    }
}

export async function user_test() {
    console.log('preparing user test:');
    /** Register test */
    try {
        const res = await registerUser(testName, testPass, testPass, testEmail, testAnswers);
        console.log(`success: created a user. expected 200, response was ${res.status}`);

        const second = await registerUser(secondName, testPass, testPass, secondEmail, secondAnswers);
        secondID = second.data.user._id;
    } catch(err) {
        console.log('failure: user creation was unsuccessful. err shown below:');
        console.log(err);
    }
    try {
        const res = await registerUser(testName, testPass, testPass, testEmail, testAnswers);
        console.log(`failure: created a user when it should not have. expected 409, response was ${res.status}`);
    } catch(err) {
        console.log('success: duplicate user not created. err shown below:');
        console.log(err);
    }
    /** Logout test */
    try {
        const res = await logout();
        console.log(`success: user was logged out. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('failure: user was not logged out. err shown below:');
        console.log(err);
    }
    /** Login test */
    try {
        const res = await login(testName, 'asdfnlgaliefudlubnafldkngalskfng');
        console.log(`failure: user was logged back in w/ wrong password. expected 400, response was ${res.status}`);
    } catch(err) {
        console.log('success: user was not logged in w/ wrong password. err shown below:');
        console.log(err);
    }
    try {
        const res = await login(testName, testPass);
        console.log(`success: user was logged back in w/ correct password. expected 200, response was ${res.status}`);
        userID = res.data.user._id
    } catch(err) {
        console.log('failure: user was not logged in w/ correct password. err shown below:');
        console.log(err);
    }
    /** Get User test */
    try {
        const res = await getUser();
        console.log(`success: self user was retrieved. expected 200, response was ${res.status}`);
        console.log(res);
    } catch(err) {
        console.log('failure: self user was not retrieved. err shown below:');
        console.log(err);
    }
    /** Follow User test */
    try {
        const res = await followUser('secondID', 'follow');
        console.log(`failure: nonexistent user was followed. expected 400, response was ${res.status}`);
    } catch(err) {
        console.log('success: nonexistent user was not followed. err shown below:');
        console.log(err);
    }
    try {
        const res = await followUser(userID, 'follow');
        console.log(`failure: user followed itself. expected 400, response was ${res.status}`);
    } catch(err) {
        console.log('success: user did not follow itself. err shown below:');
        console.log(err);
    }
    try {
        const res = await followUser(secondID, 'follow');
        console.log(`success: user was followed. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('failure: user was not followed. err shown below:');
        console.log(err);
    }
    /** Follow Content test */
    try {
        
    } catch(err) {
        console.log('Error in content creation:');
        console.log(err);
    }
    try {
        // Try to follow nonexistent content
        const res = await followContent('asdfasdfasdfasdggfdgafgwnrgsrgn', 'comic', 'follow');
        console.log(`failure: followed nonexistent content. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('success: nonexistent content not followed. err shown below:');
        console.log(err);
    }
    try {
        // Create new content and don't publish it
        const contentRes = await createNewContent('comic', 'Test Comic 2 the sequel', 'A comic for publishing testing purposes', ['Action']);
        let tempContentID = contentRes.data.content._id;

        // Try to follow unpublished content
        const res = await followContent(tempContentID, 'comic', 'follow');
        console.log(`failure: followed nonexistent content. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('success: nonexistent content not followed. err shown below:');
        console.log(err);
    }
    try {
        // Follow published content
        const res = await followContent(contentID, 'comic', 'follow');
        console.log(`success: followed content. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log('failure: content not followed. err shown below:');
        console.log(err);
    }
    /** Vote Content test */
    try {
        // Vote failure on that content
        const res = await voteOnContent('comic', contentID, 'neutral', 'neutral');
        console.log(`failure: successfully voted no-change on content. expected 400, response was ${res.status}`);
    } catch(err) {
        console.log(`success: didn't vote no-change on content. err shown below:`);
        console.log(err);
    }
    try {
        // Vote on that content
        const res = await voteOnContent('comic', contentID, 'neutral', 'like');
        console.log(`success: voted like on content. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log(`failure: didn't vote like on content. err shown below:`);
        console.log(err);
    }
    /** Vote Subcontent test */
    try {
        // Vote failure on subcontent
        const res = await voteOnSubcontent(subcontentID, 'page', 'like', 'like');
        console.log(`failure: voted no-change on subcontent. expected 400, response was ${res.status}`);
    } catch(err) {
        console.log(`success: didn't vote no-change on subcontent. err shown below:`);
        console.log(err);
    }
    try {
        // Vote on subcontent
        const res = await voteOnSubcontent(subcontentID, 'page', 'neutral', 'like');
        console.log(`success: voted like on subcontent. expected 200, response was ${res.status}`);
    } catch(err) {
        console.log(`failure: didn't vote like on subcontent. err shown below:`);
        console.log(err);
    }
}

