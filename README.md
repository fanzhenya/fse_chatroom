This is an course assignment from CMU FSE course.

![screenshot](./doc/screenshot-1.png)

![screenshot](./doc/screenshot-2.png)


## Feature Overview
### Required basic features

[x] Register for the chat room with a new username (one that does not already exist) and password
[x] Enter the chat room with his/her username and password
[x] See other users’ chat messages
[x] Post a chat message
[x] Leave the chat room

### Required constraints

[x] Chat message has user name and timestamp
[x] Real-time dynamic updated
[x] Chat messages and user info should be persisted

### Bonus Features/Constraints

[x] Online users list
[x] User online/offline notice
[x] UI should be compatible with various screen sizes
[x] Same user cannot login twice

## Design
TODO

## Implementation

- Frontend: bootstrap, jquery
  - Login/Register and Chatroom page are in one same html to avoid reloading. 
  - they are made visible/invisible with js depending on current status.
  - dynamically modify html content based on the data received from server
  
- Backend: node.js, express, socket.io, sqlite, promise
  - build up a web server with express
  - back-end and front-end exchange events/data via web sockets 
  - persist user info and message history with sqlite
  - use promise style programming to avoid `callback hell`

