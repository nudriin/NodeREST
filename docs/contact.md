# Contact API Spec

## Create Contact API

Endpoint : POST /api/contacts

Headers :

- Authorization : token

Request Body :

```json
{
  "firstName": "Nurdin",
  "lastName": "Hishasy",
  "email": "nudriin@gmail.com",
  "phone": "081231234342"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firsrtName": "Nurdin",
    "lastName": "Hishasy",
    "email": "nudriin@gmail.com",
    "phone": "081231234342"
  }
}
```

Response Body Error :

```json
{
  "errors": "email is not valid"
}
```

## Update Contact API

Endpoint : PUT /api/contacts/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "firsrtName": "Nurdin",
  "lastName": "Hishasy",
  "email": "nudriin@gmail.com",
  "phone": "081231234342"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firsrtName": "Nurdin",
    "lastName": "Hishasy",
    "email": "nudriin@gmail.com",
    "phone": "081231234342"
  }
}
```

Response Body Error :

```json
{
  "errors": "email is not valid"
}
```

## Get Contact API

Endpoint : GET /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firsrtName": "Nurdin",
    "lastName": "Hishasy",
    "email": "nudriin@gmail.com",
    "phone": "081231234342"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint : GET /api/contacts

Headers :

- Authorization : token

Query Param :

- name : Search by firstName or lastName, using like query //optional
- email : Search by email, using like query //optional
- phone : Search by phone, using like query //optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "firsrtName": "Nurdin",
      "lastName": "Hishasy",
      "email": "nudriin@gmail.com",
      "phone": "081231234342"
    },
    {
      "id": 2,
      "firsrtName": "Naruto",
      "lastName": "Uzumaki",
      "email": "naruto@uzumaki.com",
      "phone": "081231232111"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

Response Body Error :

## Remove Contact API

Endpoint : DELETE /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```
