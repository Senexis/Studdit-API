# NoSQL Opdracht | Online forum Studdit

# Links
 - Heroku: https://mighty-salt-32273.herokuapp.com/

# Endpoint list
 
### Thread endpoints
    GET:    /api/threads
    POST:   /api/threads
    GET:    /api/threads/:id
    PUT:    /api/threads/:id
    DELETE: /api/threads/:id
    GET:    /api/threads/:id/comments
    POST:   /api/threads/:id/comments
    POST:   /api/threads/:id/upvotes
    POST:   /api/threads/:id/downvotes

### Comment endpoints
    GET:    /api/comments/:id
    PUT:    /api/comments/:id
    DELETE: /api/comments/:id
    GET:    /api/comments/:id/comments
    POST:   /api/comments/:id/comments
    POST:   /api/comments/:id/upvotes
    POST:   /api/comments/:id/downvotes

### User endpoints
    GET:    /api/users
    POST:   /api/users
    GET:    /api/users/:username
    PUT:    /api/users/:username
    DELETE: /api/users/:username

### Friendship endpoints
    POST:   /api/friendships
    DELETE: /api/friendships
