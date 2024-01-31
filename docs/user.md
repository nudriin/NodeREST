# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
    {
        "username" : "nudriin",
        "password" : "rahasia",
        "name" : "Nurdin"
    }
```

Response Body Success:

```json
    {
        "data" : {
            "username" : "nudriin",
            "name" : "Nurdin"
        }
    }
```

Response Body Error :

```json
    {
        "errors" : "Username already registered"
    }
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
    {
        "username" : "nudriin",
        "password" : "rahasia"
    }
```

Response Body Success :

```json
    {
        "data" : {
            "token" : "unique-token"
        }
    }
```

Response Body Error :

```json
    {
        "errors" : "Username or password wrong"
    }
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
    {
        "name" : "Nurdin Lagi", //optional
        "password" : "password baru" // optionals
    }
```

Response Body Success :

```json
    {
        "data" : {
            "username" : "nudriin",
            "name" : "Nurdin"
        }
    }
```

Response Body Error :

```json
    {
        "errors" : "name length max 100"
    }
```

## Get User API

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success :

```json
    {
        "data" : {
            "username" : "nudriin",
            "name" : "Nurdin"
        }
    }
```

Response Body Error :

```json
    {
        "errors" : "Unautorized"
    }
```

## Logout User API
Endpoint : DELETE /api/users/logout

Response Body Success :

```json
    {
        "data" : "OK"
    }
```

Response Body Error :

```json
    {
        "errors" : "Unauthorized"
    }
```
