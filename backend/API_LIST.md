TechTribe

AuthRouter

- POST /signup
- POST /login
- POST /logout

ProfileRouter

- GET /profile/view
- Patch /profile/edit
- Patch /profile/password

ConnectionsRequestRouter

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

UserRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed

Status: ignore , intrested , accepted ,rejected
