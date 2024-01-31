# Address API Spec

## Create Address API

Endpoint : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan Setia Yakin",
  "city": "Sukamara",
  "province": "Kalimantan Tengah",
  "country": "Indonesia",
  "postalCode": "74712"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Setia Yakin",
    "city": "Sukamara",
    "province": "Kalimantan Tengah",
    "country": "Indonesia",
    "postalCode": "74712"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/:contactId/addresses/addressId

Headers :

- Authorization : token

Request Body :

```json
{
  "street": "Jalan Setia Yakin",
  "city": "Sukamara",
  "province": "Kalimantan Tengah",
  "country": "Indonesia",
  "postalCode": "74712"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Setia Yakin",
    "city": "Sukamara",
    "province": "Kalimantan Tengah",
    "country": "Indonesia",
    "postalCode": "74712"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Get Address API

Endpoint : GET /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Setia Yakin",
    "city": "Sukamara",
    "province": "Kalimantan Tengah",
    "country": "Indonesia",
    "postalCode": "74712"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## List Addresses API

Endpoint : GET /api/contacts/:contactId/addresses

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan Setia Yakin",
      "city": "Sukamara",
      "province": "Kalimantan Tengah",
      "country": "Indonesia",
      "postalCode": "74712"
    },
    {
      "id": 2,
      "street": "Jalan Pangeran Samudera",
      "city": "Palangka Raya",
      "province": "Kalimantan Tengah",
      "country": "Indonesia",
      "postalCode": "74712"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Remove Address API

Endpoint : DELETE /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token

Response Body Success :
```json
{
    "data" : "OK"
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```
