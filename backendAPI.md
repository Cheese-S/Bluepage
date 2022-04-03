# API DOCUMENT

---

# Models

---
## USER
    _id: ObjectID
    name: String,
    email: String,
    password: String
    isAdmin: boolean
    comicNotifications: [notification]
    storyNotifications: [notification]
    followers: [ObjectID]
    followingComics: [ObjectID]
    followingStories: [ObjectID]
    likedComics: [ObjectID]
    dislikedComics: [ObjectID]
    likedStories: [ObjectID]
    likedPages: [ObjectID]
    dislikedPages: [ObjectID]
    likedChapters: [ObjectID]
    dislikedChapters: [ObjectID]
    ownComics: [ObjectID]
    ownStories: [ObjectID]
    answers: [string]

### Notification

    text: String
    link: ObjectID
    createdAt: Date

## Content (Story and Comic)
    _id: ObjectID
    title: String
    description: String
    author: UserData
    views: Number
    followers: Number
    published: boolean
    tags: [BP_TAGS]
    likes: Number
    dislikes: Number
    contentList: [{ subcontent: ObjectId }]
    comments: [Comment]
    thumbnail: Buffer

### UserData
    id: ObjectID
    name: String

### Comment
    _id: ObjectID
    user: UserData
    text: String
    subcomments: [subcomment]
    createdAt: Date

#### subcomment

    user: UserData
    text: String
    createdAt: Date

## Subcontent (Chapter and Page)

    title: String
    parentID: ObjectId
    body: Object -> where we store content / editor content
    author: UserData
    views: Number
    likes: Number
    dislikes: Number
    published: boolean
    comments: [comment]

== 

I chose body as content / editor content since content is rather ambiguous term in this context. 

I was too far gone when I realized I probably shouldn't user content/subcontent.

==

---
# Enums

### FOLLOW_ACTION_TYPE

    - 'follow'
    - 'unfollow'

### COMMENT_ACTION_TYPE

    - 'comment'
    - 'subcomment'

### CONTENT_TYPE

    - 'story'
    - 'comic
  
### SUBCONTENT_TYPE

    - 'chapter'
    - 'page'

### BP_TAGS

    - 'Action'
    - 'Romance'
    - 'Mystery'
    - 'Fantasy'
    - 'Historical'
    - 'Comedy'
    - 'Fanwork'
    - 'Sci-F
    - 'Thriller'
    - 'Psychological'

### VOTE_STATE_TYPE

    - 'like'
    - 'dislike'
    - 'netural'
---
# Routes

--- 

## Helper Routes

### /healthcheck
    - Description
      - Check if the server is online
    - Response
      - 200
          - if the server is online
### /query-test
    - Description
      - Helper route to let you check your query object
    - Request Query
      - Any Query
    - Request Body
    - Response
      - 200
        - A JSON object of your query

---

## User Routes

### Same color as in postman

💚 **GET** 💚

💛 **POST** 💛

💙 **PUT** 💙

❤️ **DELETE** ❤️

⚠️ **JWT REQUIRED** ⚠️

🛑 **ADMIN ONLY** 🛑

## Note: all routes starts with /api/users 
    - e.g 
      - /login = /api/users/login

⚠️ **NO SPECIFIC PATH MEANS ITS JUST /api/users** ⚠️

## Return Models

### User (Database User - (Answers + Password) + isLoggedIn)

    _id: ObjectID
    name: String,
    email: String,
    isAdmin: boolean
    comicNotifications: [notification]
    storyNotifications: [notification]
    followers: [ObjectID]
    followingComics: [ObjectID]
    followingStories: [ObjectID]
    likedComics: [ObjectID]
    dislikedComics: [ObjectID]
    likedStories: [ObjectID]
    likedPages: [ObjectID]
    dislikedPages: [ObjectID]
    likedChapters: [ObjectID]
    dislikedChapters: [ObjectID]
    ownComics: [ObjectID]
    ownStories: [ObjectID]
    isLoggedIn: boolean


### Content 

    _id: ObjectID
    title: String
    description: String
    author: UserData
    views: Number
    followers: Number
    published: boolean
    tags: [BP_TAGS]
    likes: Number
    dislikes: Number
    contentList: [
      { 
        subcontent: {
          _id: ObjectId,
          title: String,
          published: boolean
        }
      } 
    ]
    comments: [Comment]
    thumbnail: Buffer

### Subcontent Same as Database Subcontent


### 💛 **POST** 💛 
    - Description
      - Register a new user
    - Request Body
      - name: String
        - must be unique 
      - password: String
        - length > 8
      - passwordConfirmation: String
        - passwordConfirmation === password
      - email: String
        - must be a valid email
        - must be unique
      - answers: [String]
        - length = 3
    - Response
      - 200
        - user: User
      - 400
        - error: String
          - Requst body does not match schema
      - 500
        - Database / Server error
        - error: String
    - Example
      {
        name: "john doe"
        password: "12345678"
        passwordConfirmation: "12345678"
        email: "fakeacc@aaa.com"
        answers: ["SHanghai", "NewYork","USA"]
      }
### 💛 **POST** 💛 /login
    - Description
      - Login in a user
    - Request Body
      - nameOrEmail: String
      - password: String
    - Response
      - 200
        - user: User
        - A valid JWT is signed and sent back to the user using Cookie
      - 400
        - error: String
          - User does not exist
          - Password is wrong
          - Requst body does not match schema
          - Database error
    - Example
      {
        nameOrEmail: "john doe" or "fakeacc@aaa.com"
        password: "12345678"
      }
### 💛 **POST** 💛 /logout
    - Description
      - Logout a user
    - Request Body
    - Response
      - 200
        - A invalid JWT is signed and sent back to the user using cookie
    - Example
      {}

### 💚 **GET** 💚 
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Get an authorized user's user object
    - Request Body
    - Response
      - 200
        - user: User
      - 400
        - error: String
          - Somehow the user does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authrization Failed
    - Example
      {}

### 💚 **GET** /:id💚
    NOTE: THE USER WILL NOT HAVE FIELDS ['password', 'answers', 'comicNotifications', 'storyNotifications', 'isAdmin']
    THE CONTENT WILL NOT HAVE FIELDS ['contentList', 'comments', 'publihsed' (since all contents should be published)]
    - Description
      - Get an user's user object and his **published** content
    - Request Body
    - Request Param
      - id: ObjectID
    - Response
      - 200
        - user: User
      - 400
        - error: String
          - user does not exist
          - Does not match Schema
    - Example
      {}

### 💙 **PUT** 💙 /followUser
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Follow / Unfollow another user
      - Following the same user multiple times would not result in error. A user's followers is treated as a set (meaning no duplicate records)
    - Request Body
      - followingUserID: String
        - another user's ObjectID 
        - length = 24 
      - action: FOLLOW_ACTION_TYPE
    - Response
      - 200
        - user: User
          - The user being followed
      - 400
        - error: String
          - Does not match schema
          - self following
          - cannot find either user
      - 401
        - error: String
        - user: emptyUser
          - Authorization Failed
      - 500
        - Database / Server error
        - error: String
    -  Example
      {
        followingUserID: "623e6fd6fe0719ac234e7759",
        action: "follow"
      }
### 💙 **PUT** 💙 /followContent
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Follow a piece of content
    - Request Body
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
      - action: FOLLOW_ACTION_TYPE
    - Response
      - 200
        - user: User
        - content: Content
      - 400
        - error: String
          - Does not match schema
          - Following contents that has not yet been published
          - Failed to find content / user
      - 500
        - error: String
          - Database / Server error
    -  Example
      {
        "contentType": "comic",
        "contentID" : "623e544a7d1193733278b107",
        "action": "follow"
      }
### 💙 **PUT** 💙 /voteOnContent
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Voting on a piece of content
    - Request Body
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
      - prev: VOTE_STATE_TYPE
        - prev !== current 
      - current: VOTE_STATE_TYPE
        - prev !== current
    - Response
      - 200
        - user: User
        - content: Content
      - 400
        - error: String
          - Does not match schema
          - Vote on contents that has not yet been published
          - Failed to find content / user
      - 401
        - Ahtuhorization Failed
      - 500
        - error: String
          - Database / Server error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e544a7d1193733278b107",
        "prev": "dislike",
        "current": "neutral"
    }
### 💙 **PUT** 💙 /voteOnSubcontent
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Voting on a piece of subcontent
    - Request Body
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
      - prev: VOTE_STATE_TYPE
        - prev !== current 
      - current: VOTE_STATE_TYPE
        - prev !== current
    - Response
      - 200
        - user: User
        - subcontent: Subcontent
      - 400
        - Does not match schema
        - Vote on contents that has not yet been published
        - Failed to find subcontent / user
        - 
      - 401
        - Ahtuhorization Failed
      - 500
        - error: String
          - Database / Server error
    - Example
    {
        "subcontentType": "chapter",
        "subcontentID": "623e544a7d1193733278b107",
        "prev": "dislike",
        "current": "neutral"
    }
### 💙 **PUT** 💙 /password
    - When a user is logged in
        ⚠️ JWT REQUIRED ⚠️
        - Description
          - Change a user's password
        - Request Body
          - password: String
            - password === passwordConfirmation
          - passwordConfirmation: String
          - isLoggedIn: true 
        - Response
          - 200
          - 400
            - error: String
              - does not match schema
              - failed to find user
          - 401
            - error: String
              - Authorization Failed
          - 500
            - error: String
              - Database / Server error
        - Example 
        {
            "isLoggedIn": true,
            "nameOrEmail": "john doe",
            "password": "12345678",
            "passwordConfirmation": "12345678"
        }
    - When a user is not logged in
        - Description
          - Change a user's password
        - Request Body
          - password: String
            - password === passwordConfirmation
          - passwordConfirmation: String
          - isLoggedIn: true 
          - answers: [string]
            - length = 3
        - Response
          - 200
            - user: User
          - 400
            - error: String
              - User does not exist
              - does not match schema
              - answers are wrong
          - 401
            - error: String
              - Authorization Failed
          - 500
            - error: String
              - Database / Server error
        - Example
        {
            "isLoggedIn": false,
            "nameOrEmail": "john doe",
            "password": "12345678",
            "passwordConfirmation": "12345678",
            "answers": ["aa", "bb", "cc"]
        }
---
## Content Route

## Note: all routes starts with /api/content 
    - e.g 
      - /view = /api/content/view

⚠️ **NO SPECIFIC PATH MEANS ITS JUST /api/content** ⚠️

### 💛 **POST** /paginate 💛
    ⚠️ SEE https://www.npmjs.com/package/mongoose-paginate-v2 ⚠️
    - Description
      - Get paginated content based on query
    - Request Query
      - Paginate Option (see above)
    - Request Body
      - contentType: CONTENT_TYPE
      - query: Mongoose Query 
    - Response
      - 200
        - result: result (see above link)
      - 400
        - does not match schema
    - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    http://localhost:4000/api/content/?page=1&limit=1
    {
      "contentType": "comic",
      "query": {}
    }

### 💚 **POST** 💚 /id
    - Description
      - Get a content by ID
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - Non owner attempting to get a unpublished content
    - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e534778d5c84703f84dfe"
    }

### 💛 **POST** 💛
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Create a new content 
    - Request
      - contentType: CONTENT_TYPE
      - title: String
      - description: String
      - tags: [BP_TAGS]
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "title": "BAD",
        "description": "DO NOT WATCH",
        "tags": ["Action"]
    }
### 💛 **POST** 💛 /thumbnail
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Upload a thumbnail
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
      - thumbnail
        - A png file
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - content does not belong to user 
        - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e534778d5c84703f84dfe"
    }

### 💙 **PUT** 💙
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Upadte a piece of content 
      - ** IFF published = true **
        - A notification will be pushed to users that follow whoever made this request
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
      - title: String
      - description: String
      - contentID: ObjectID
      - published: boolean
      - tags: [BP_TAGS]
      - subcontentIDs [ObjectID]
        - ** IFF published = true  **
        - list of subcontentIDs to be published together
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - content already published 
        - content does not belong to user 
        - User does not exist
        - subcontent does not belong to content
        - subcontent does not belong to user
        - subcontent are published
        - subcontent does not exist
        - content & subcontent type does not agree
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "title": "Jenny",
        "description": "nope i hate this now ",
        "contentID": "623c9d75f6914aa6d18abddc",
        "subcontentIDs": ["623e544a7d1193733278b107"], 
        "published": true,
        "tags" : ["Action"]
    }

    {
        "contentType": "comic",
        "title": "Jenny",
        "description": "nope i hate this now ",
        "contentID": "623c9d75f6914aa6d18abddc",
        "published": false,
        "tags" : ["Action"]
    }



### 💙 **PUT** 💙 /comment
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - comment a content / subcomment a content
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
      - action: COMMENT_ACTION_TYPE
      - commentID: ObjectID
        - ** IFF action = 'subcomment' **
      - comment: String
        - The actual comment itself
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - content not published 
        - User does not exist
        - A comment to be subcommented on does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e544a7d1193733278b107",
        "action": "comment",
        "comment": "This is a great comic"
    }

    {
        "contentType": "comic",
        "contentID": "623e544a7d1193733278b107",
        "action": "subcomment",
        "comment": "This is a BAD comic",
        "commentID": "623e61ef57191cf1284bebdd"
    }

### 💙 **PUT** 💙 /takeoff
    ⚠️ JWT REQUIRED ⚠️
    🛑 **ADMIN ONLY** 🛑
    - Description
      - takeoff a piece of content
      - A notification will be pushed to a user to let them know that their content has been taken off
      - All of this content's subcontent will be taken off as well. 
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - content not published 
        - User does not exist
        - User is not an admin
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e534778d5c84703f84dfe"
    }

### 💙 **PUT** 💙 /view
    - Description
      - Add 1 to a content's views
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist
        - content not published 
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e534778d5c84703f84dfe"
    }

### ❤️ **DELETE** ❤️ 
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Delete a piece of content and all of its subcontents
      - This content will be removed from all user's liked/disliked list, following list, and own lis.
    - Request
      - contentType: CONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - content: Content
      - 400
        - does not match schema
        - content does not exist 
        - content does not belong to user 
        - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "contentType": "comic",
        "contentID": "623e534778d5c84703f84dfe"
    }

--- 
## Subcontent Route

## Note: all routes starts with /api/subcontent 
    - e.g 
      - /view = /api/subcontent/view

⚠️ **NO SPECIFIC PATH MEANS ITS JUST /api/subcontent** ⚠️

### 💛 **POST** 💛 /id
    - Description
      - Get a subcontent by ID
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - subcontent: Subcontent
      - 400
        - error: String
          - does not match schema
          - subcontent does not exist
          - Non owner attempting to get a unpublished subcontent
    - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "subcontentType": "page",
        "subcontentID": "623f883526f9a98b9a0c508d"
    }

### 💛 **POST** 💛
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Create a new subcontent 
      - Append the id to the parents' content list
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - parentID: ObjectID
      - title: String
      - body: Object
    - Response
      - 200
        - content: Content
          - The parent content
        - subcontent: Subcontent
      - 400
        - error: String
          - does not match schema
          - User does not exist
          - The parent content does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "parentID": "623fa94b1bc1a7d577650c96",
        "subcontentType": "page",
        "title": "DUMBBBBBBB",
        "body": {}
    }

### 💙 **PUT** 💙
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Upadte a piece of subcontent 
      - ** IFF published = true ** A notification will be pushed to tell user a content has been updated
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - subcontentID: ObjectID
        - length = 24
      - title: String
      - body: Object
      - published: boolean
      - parentID: ObjectID
    - Response
      - 200
        - subcontent: subcontent
      - 400
        - error: String
          - does not match schema
          - subcontent does not exist
          - subcontent already published 
          - subcontent does not belong to user 
          - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "subcontentType": "page",
        "subcontentID": "623f883826f9a98b9a0c5091",
        "title": "SICK aGE2",
        "body": {"a": 5},
        "published": true,
        "parentID": "623f883826f9a98b9a409cd9"
    }



### 💙 **PUT** 💙 /comment
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - comment a subcontent / subcomment a subcontent
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - subcontentID: ObjectID
        - length = 24
      - action: COMMENT_ACTION_TYPE
      - commentID: ObjectID
        - ** IFF action = 'subcomment' **
      - comment: String
        - The actual comment itself
    - Response
      - 200
        - subcontent: subcontent
      - 400
        - error: String
          - does not match schema
          - subcontent does not exist
          - subcontent not published 
          - User does not exist
          - A comment to be subcommented on does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "subcontentType": "page",
        "subcontentID": "623f883826f9a98b9a0c5091",
        "action": "comment",
        "comment": "YOYO ITS GOOD OR WHAT"
    }

    {
        "subcontentType": "page",
        "subcontentID": "623f883826f9a98b9a0c5091",
        "action": "subcomment",
        "comment": "NO ITS SUPER BAD< DONT READ IT ",
        "commentID": "623f8a86a0bd625a1c927714"
    }

### 💙 **PUT** 💙 /takeoff
    ⚠️ JWT REQUIRED ⚠️
    🛑 **ADMIN ONLY** 🛑
    - Description
      - takeoff a piece of subcontent
      - A notification will be pushed to a user to let them know that their subcontent has been taken off
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - subcontent: subcontent
      - 400
        - error: String
          - does not match schema
          - subcontent does not exist
          - subcontent not published 
          - User does not exist
          - User is not an admin
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - error: String
          - Server / Database error
    - Example
    {
        "subcontentType": "page",
        "subcontentID": "623f883826f9a98b9a0c5091",
    }

### 💙 **PUT** 💙 /view
    - Description
      - Add 1 to a subcontent's views
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - contentID: ObjectID
        - length = 24
    - Response
      - 200
        - subcontent: subcontent
      - 400
        - error: String
          - does not match schema
          - subcontent does not exist
          - subcontent not published 
      - 500
        - error: String
          - Server / Database error
    - Example
    {
        "subcontentType": "chapter",
        "contentID": "623e534778d5c84703f84dfe"
    }

### 💙 **PUT** 💙 /publish
    - Description
      - publish subcontents
      - Notification will be pushed to tell a user a content has been updated
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - subcontentIDs: [ObjectID]
        - length = 24
      - parentID: ObjectID
    - Response
      - 200
      - 400
        - error: String
          - does not match schema
          - subcontent does not belong to content
          - subcontent does not belong to user
          - subcontent are published
          - subcontent does not exist
          - content & subcontent type does not agree 
          - parent content is not published
          - parent content does not belong to user
          - user does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - error: String
          - Server / Database error
    - Example
    {
        "subcontentType": "chapter",
        "subcontentIDs": "[623e534778d5c84703f84dfe]",
        "parentID": "623e534778d5c84703f84dfe"
    }

### ❤️ **DELETE** ❤️ 
    ⚠️ JWT REQUIRED ⚠️
    - Description
      - Delete a piece of subcontent
    - Request
      - subcontentType: SUBCONTENT_TYPE
      - subcontentID: ObjectID
        - length = 24
    - Response
      - 200
        - subcontent: subcontent
      - 400
        - does not match schema
        - subcontent does not exist 
        - subcontent does not belong to user 
        - User does not exist
      - 401
        - error: String
        - user: emptyUser
          - Authorization failed
      - 500
        - Server / Database error
    - Example
    {
        "subcontentType": "page",
        "contentID": "623e534778d5c84703f84dfe"
    }

