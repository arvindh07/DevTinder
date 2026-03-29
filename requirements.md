DevTinder

1. Create an account
2. Login
3. Update your profile
4. Feed page - Explore
5. Send connection request
6. See our matches
7. See the request that we made
8. Update profile

LLD

1. DB design
- users - firstname, lastname, email, gender, profile pic, password
- connectionRequest 
    - fromUserId
    - toUserId
    - status - pending, ignored, accepted, rejected

2. APIS
- /signup
- /login
- /profile - get, post
- /send-request - interest, ignore
- /review-request - accept, reject
- /requests - see all requests
- /connections - to see all connected profiles