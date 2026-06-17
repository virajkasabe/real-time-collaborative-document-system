## BACKEND AUTHENTICATION

### REGISTER - POST

```bash

   http://localhost:5000/api/v1/rtcds/auth/register

```

- body data like

```json
{
  "fullName": "FirstName LastName",
  "email": "example@gmail.com",
  "password": "Password@1234"
}
```

### VERIFY_USER_EMAIL - POST

- The api from console

```bash

   http://localhost:5000/api/v1/rtcds/auth/verify-email/:unHashToken

```

- params data

```json
{
  "unHashToken": "unHashToken"
}
```

- body data like

```json
{
  "otp": "RANDOM_OTP_FROM_CONSOLE"
}
```

### VERIFY_USER_EMAIL_REQUEST - POST

- when user has otp not valid or expired or any other qury then use this api for retry

```bash

   http://localhost:5000/api/v1/rtcds/auth/verify-email-request

```

- body data like

```json
{
  "email": "example@gmail.com"
}
```

### LOGIN - POST

```bash

   http://localhost:5000/api/v1/rtcds/auth/login

```

- body data like

```json
{
  "email": "example@gmail.com",
  "password": "Password@1234"
}
```

### LOGOUT - GET

```bash

 http://localhost:5000/api/v1/rtcds/auth/logout

```

- don't pass data

### FETCH_USER - GET

```bash

http://localhost:5000/api/v1/rtcds/auth/getme

```

- don't pass data

### FETCH_USER - GET

```bash

http://localhost:5000/api/v1/rtcds/auth/getme

```

- don't pass data

### UPDATE_USER - PUT

```bash

http://localhost:5000/api/v1/rtcds/auth/update-profile

```

- data like

```json
{
  "fullName": "FirstName LastName",
  "avatar": "https://i.pinimg.com/474x/1f/a1/66/1fa166b8be7105927a3af53cc8891458.jpg"
}
```

### REFRESH_TOKEN_REFRESHED - POST

- when user refreshtoken expired

```bash

http://localhost:5000/api/v1/rtcds/auth/refresh-token-refreshed

```

- data like

```json
{
  "refreshToken": "refreshTokenSecret"
}
```

### FORGET_PASSWORD_REQUEST - POST

- forget user password

```bash

http://localhost:5000/api/v1/rtcds/auth/c

```

- data like

```json
{
  "email": "example@gmail.com"
}
```

### RESET_PASSWORD - POST

- when user refreshtoken expired

```bash

http://localhost:5000/api/v1/rtcds/auth/reset-password/:unHashedToken

```

- params data

```json
{
  "unHashToken": "unHashToken"
}
```

- body data like

```json
{
  "newPassword": "newPassword",
  "confirmPassword": "confirmPassword"
}
```

### CHANGE_CURRENT_PASSWORD - POST

```bash

http://localhost:5000/api/v1/rtcds/auth/update-current-password

```

- data like

```json
{
  "oldPassword": "oldPassword",
  "newPassword": "newPassword",
  "confirmPassowrd": "confirmPassowrd"
}
```

### DELTE_USER - DELETE

- user login first for id and token

```bash

   http://localhost:5000/api/v1/rtcds/auth/delete

```

- don't pass any data
