![Barney Awesomeness](http://static.celebuzz.com/uploads/2013/06/14/request-five.gif)

## Notes

#### Endpoints
* `/analyse`
* `/analyse/:requestId`

#### Example Request Body
```json
{
     "query": “me and paddington have a meeting”
}
```

#### Example Response Body
```json
{
    "requestId": 007,
    "success": true,
    "needAnswer": true,
    "results": [{
        "type": 'response',
        "content": 'alright, I do need some more info'
    }, {
        "type": 'question',
        "content": {
            "main": 'What time is your meeting?'
        }
    }]
}
```
