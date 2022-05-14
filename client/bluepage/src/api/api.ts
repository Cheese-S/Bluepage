import Axios from "axios";
import { BP_TAGS, COMMENT_ACTION_TYPE, CONTENT_TYPE, FOLLOW_ACTION_TYPE, SUBCONTENT_TYPE, VOTE_STATE_TYPE } from "../constant";

Axios.defaults.withCredentials = true;
let url: string;

if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:4000/api'; 
} else {
    url = 'http://18.217.187.50/backend'
}
const api = Axios.create({
    baseURL: url,
});



export const registerUser = (username: string, password: string, passwordConfirmation: string, email: string, answers: string[]) => {
    return api.post(`/users`, {
        name: username,
        password: password,
        passwordConfirmation: passwordConfirmation,
        email: email,
        answers: answers
    });
};

export const login = (nameOrEmail: string, password: string) => {
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

export const followUser = (followingUserID: string, action: FOLLOW_ACTION_TYPE) => {
    return api.put(`/users/followUser`, {
        followingUserID: followingUserID,
        action: action
    });
};

export const changeUserDescription = (description: string) => {
    return api.put('/users/description', {
        description: description
    })
}

export const createNewContent = (
    contentType: CONTENT_TYPE,
    title: string,
    description: string,
    tags: BP_TAGS[]) => {

    return api.post(`/content`, {
        contentType: contentType,
        title: title,
        description: description,
        tags: tags,
    });
};

export const publishContent = (
    title: string,
    description: string,
    tags: BP_TAGS,
    contentID: string,
    contentType: CONTENT_TYPE,
    subcontentIDs: string[]) => {

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

export const createNewSubcontent = (
    parentID: string,
    subcontentType: SUBCONTENT_TYPE,
    title: string,
    body: string) => {

    return api.post(`/subcontent`, {
        parentID,
        subcontentType,
        title,
        body,
    });
};

export const publishSubcontent = (
    subcontentType: SUBCONTENT_TYPE,
    subcontentIDs: string[],
    parentID: string) => {
    return api.put(`/subcontent/publish`, {
        subcontentType,
        subcontentIDs,
        parentID,
    });
};

export const followContent = (
    contentID: string,
    contentType: CONTENT_TYPE,
    action: FOLLOW_ACTION_TYPE) => {
    return api.put(`users/followContent`, {
        contentID: contentID,
        contentType: contentType,
        action: action,
    });
};

export const voteOnContent = (
    contentType: CONTENT_TYPE,
    contentID: string,
    prev: VOTE_STATE_TYPE,
    current: VOTE_STATE_TYPE) => {
    return api.put(`users/voteOnContent`, {
        contentType,
        contentID,
        prev,
        current,
    });
};

export const voteOnSubcontent = (
    subcontentID: string,
    subcontentType: SUBCONTENT_TYPE,
    prev: VOTE_STATE_TYPE,
    current: VOTE_STATE_TYPE) => {
    return api.put(`users/voteOnSubcontent`, {
        subcontentID,
        subcontentType,
        prev,
        current,
    });
};

export const changePassword = (password: string) => {
    return api.put(`users/password`, {
        isLoggedIn: true,
        password,
        passwordConfirmation: password,
    });
};

export const changePasswordLoggedOut = (password: string, answers: string[], nameOrEmail: string) => {
    return api.put(`users/password`, {
        isLoggedIn: false,
        password,
        passwordConfirmation: password,
        answers,
        nameOrEmail,
    });
};

export const getUserByID = (id: string) => {
    return api.get(`users/${id}`, {
    });
};

export const removeNotification = (contentType: CONTENT_TYPE, notificationID: string) => {
    return api.put('/api/users/notification/remove', {
        contentType: contentType,
        notificationID: notificationID
    })
}


export const getContentPage = (contentType: CONTENT_TYPE, query: any, option: any) => {
    return api.post(`/content/paginate/`, {
        contentType: contentType,
        query: query
    }, {params: option})
}


export const getContentById = (contentType: CONTENT_TYPE, contentID: string) => {
    return api.post(`/content/id`, {
        contentType: contentType,
        contentID: contentID
    })
}

export const uploadThumbnaill = (contentType: CONTENT_TYPE, contentID: string, thumbnail: any) => {
    var bodyFormData = new FormData();
    bodyFormData.append('contentType', contentType);
    bodyFormData.append('contentID', contentID);
    bodyFormData.append('thumbnail', thumbnail);
    return api.post(`/content/thumbnail`, bodyFormData, { headers: { 'Content-Type': 'multipart/form-data', } }
    )
}

export const updateContent = (
    contentType: CONTENT_TYPE,
    title: string,
    description: string,
    contentID: string,
    subcontentIDs: string[],
    published: boolean,
    tags: BP_TAGS[]) => {
    return api.put(`/content`, {
        contentType: contentType,
        title: title,
        description: description,
        contentID: contentID,
        subcontentIDs: subcontentIDs,
        published: published,
        tags: tags
    })
}

export const commentContent = (
    contentType: CONTENT_TYPE,
    contentID: string,
    comment: string) => {
    return api.put(`/content/comment`, {
        contentType: contentType,
        contentID: contentID,
        action: COMMENT_ACTION_TYPE.COMMENT,
        comment: comment
    })
}

export const subcommentContent = (
    contentType: CONTENT_TYPE,
    contentID: string,
    commentID: string,
    comment: string) => {
    return api.put(`/content/comment`, {
        contentType: contentType,
        contentID: contentID,
        action: COMMENT_ACTION_TYPE.SUBCOMMENT,
        commentID: commentID,
        comment: comment
    })
}

export const commentSubcontent = (
    subcontentType: SUBCONTENT_TYPE,
    subcontentID: string,
    comment: string) => {
    return api.put(`/subcontent/comment`, {
        subcontentType: subcontentType,
        subcontentID: subcontentID,
        action: COMMENT_ACTION_TYPE.COMMENT,
        comment: comment
    })
}

export const subcommentSubcontent = (
    subcontentType: SUBCONTENT_TYPE,
    subcontentID: string,
    commentID: string,
    comment: string) => {
    return api.put(`/subcontent/comment`, {
        subcontentType: subcontentType,
        subcontentID: subcontentID,
        action: COMMENT_ACTION_TYPE.SUBCOMMENT,
        comment: comment,
        commentID: commentID
    })
}


export const viewContent = (contentType: CONTENT_TYPE, contentID: string) => {
    return api.put(`/content/view`, {
        contentType: contentType,
        contentID: contentID
    })
}

export const takeoffContent = (contentType: CONTENT_TYPE, contentID: string) => {
    return api.put(`/content/takeoff`, {
        contentType: contentType,
        contentID: contentID
    })
}

export const deleteContent = (contentType: CONTENT_TYPE, contentID: string) => {
    return api.delete(`/content`, { data: { contentType: contentType, contentID: contentID } });
}

export const viewSubcontent = (subcontentType: SUBCONTENT_TYPE, subcontentID: string) => {
    return api.put(`/subcontent/view`, {
        subcontentType: subcontentType,
        subcontentID: subcontentID
    })
}

export const getSubcontentByID = (
    subcontentID: string, 
    subcontentType: SUBCONTENT_TYPE) => {
    return api.post(`/subcontent/id`, {
        subcontentID: subcontentID,
        subcontentType: subcontentType
    })
}

export const createNewSubContent = (
    contentID: string, 
    subcontentType: SUBCONTENT_TYPE, 
    title: string, 
    body: any) => {
    return api.post(`/subcontent`, {
        parentID: contentID,
        subcontentType: subcontentType,
        title: title,
        body: body
    })
}

export const updateSubContent = (
    subcontentType: SUBCONTENT_TYPE, 
    subcontentID: string, 
    title: string, 
    body: Object, 
    publshed: boolean, 
    parentID: string) => {
    return api.put(`/subcontent`, {
        subcontentType: subcontentType,
        subcontentID: subcontentID,
        title: title,
        body: body,
        published: publshed,
        parentID: parentID
    })
}

export const publishSubContent = (
    subcontentType: SUBCONTENT_TYPE, 
    subcontentIDs: string[], 
    contentID: string) => {
    return api.put(`/subcontent/publish`, {
        subcontentType: subcontentType,
        subcontentIDs: subcontentIDs,
        parentID: contentID
    })
}

export const deleteSubcontent = (subcontentType: SUBCONTENT_TYPE, subcontentID: string) => {
    return api.delete('/subcontent', { data: 
        { subcontentType: subcontentType, subcontentID: subcontentID } 
    })
}
export const takeOffSubcontent = (subcontentType: SUBCONTENT_TYPE, subcontentID: string) => {
    return api.put('/subcontent/takeoff', {
        subcontentType: subcontentType,
        subcontentID: subcontentID
    })
}