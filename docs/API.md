# API Reference

# Authentication Endpoints

### Sign Up

```http
POST /api/auth/signup
```

#### Request Body

| Field     | Type   | Description          |
| --------- | ------ | -------------------- |
| firstName | string | User's first name    |
| lastName  | string | User's last name     |
| email     | string | User's email address |
| password  | string | User's password      |

#### Response

```javascript
{
"msg": "Created User <firstName> <lastName> Successfully"
}
```

#### Response Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 201         | Created - User created successfully                      |
| 400         | Bad Request - Invalid user data                          |
| 500         | Internal Server Error - Server failed to process request |

### Login

```http
POST /api/auth/signin
```

#### Request Body

| Field    | Type   | Description          |
| -------- | ------ | -------------------- |
| email    | string | User's email address |
| password | string | User's password      |

#### Response

```javascript
{
"userID": "string",
"firstName": "string",
"lastName": "string",
"email": "string",
"accessToken": "string"
}
```

#### Response Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 200         | OK - User logged in successfully                         |
| 400         | Bad Request - Invalid email/password                     |
| 500         | Internal Server Error - Server failed to process request |

### Refresh Token

```http
PATCH /api/auth/refresh-token
```

#### Headers

| Key           | Value          |
| ------------- | -------------- |
| Authorization | Bearer <token> |

#### Response

```javascript
{
"userID": "string",
"firstName": "string",
"lastName": "string",
"email": "string",
"accessToken": "string"
}
```

#### Response Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 200         | OK - Tokens refreshed successfully                       |
| 401         | Unauthorized - Invalid or expired token                  |
| 500         | Internal Server Error - Server failed to process request |

### Logout **`[token required]`**

```http
POST /api/auth/logout
```

#### Response Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 200         | OK - User logged out successfully                        |
| 500         | Internal Server Error - Server failed to process request |

# User Endpoints

### Get Current User Details **`[token required]`**

```http
GET /api/user/me
```

#### Headers

| Key           | Value          |
| ------------- | -------------- |
| Authorization | Bearer <token> |

#### Response

```javascript
{
    "userID": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
}
```

#### Response Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 200         | OK - User details retrieved successfully                 |
| 401         | Unauthorized - Invalid or missing token                  |
| 500         | Internal Server Error - Server failed to process request |
