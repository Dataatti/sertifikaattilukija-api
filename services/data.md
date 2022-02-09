# Data API

Find company information based on search parameters

**URL** : `/api/data`

**Query Parameters** :

- `name=[string]` where `name` is the name or VAT number of the company.
  - example: `name=yritys`
- `city=[string]` where `city` is the name of the city or cities
  - example for one city: `city=turku`
  - example for multiple cities: `city=turku,helsinki,tampere`
- `certificate=[string]` where `certificate` is the id of the certificate
  - example for one certificate: `certificate=sft`
  - example for multiple certificates: `certificate=sft,wwf-green-office`
- `limit=[integer]` where `limit` is the number of results the response will be limited to
- `offset=[integer]` where `offset` is the number of results that will be offset

All the previous can be combined to make more complex search queries.
For example: `city=turku,helsinki&certificate=sft` would return all companies with SFT certificate from the cities Turku and Helsinki.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "totalResults": 22,
  "resultsFrom": 0,
  "data": [
    {
      "companyId": 9055,
      "name": "Esimerkki Oy",
      "vatNumber": "1234567-2",
      "address": "Esimerkkikatu 1",
      "postCode": "12345",
      "city": "TURKU",
      "certificateId": ["sft"]
    }
  ]
}
```

## Error Responses

**Condition** : If something went wrong with the request.

**Code** : `500`

**Content** :

```json
{ "msg": "Error message" }
```
