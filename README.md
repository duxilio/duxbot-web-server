![Barney Awesomeness](http://static.celebuzz.com/uploads/2013/06/14/request-five.gif)

#### Endpoints
* `/analyse`
* `/analyse/:requestId`

#### Example Request Body
```json
{
     "query": "me and paddington have a meeting"
}
```

#### Example Response Body
```json
{
    "success": true,
    "type": "response",
    "message": "Event Created",
    "details": {
        "inviteEmails": [
            "matti@duxilio.com",
            "koen@duxilio.com"
        ],
        "time": "2pm",
        "date": "tomorrow",
        "name": "awesomeness4eva"
  }
}
```

#### How the Duxbot Library Works
1. Put query in analyser (this converts what the user says to a JSON response we understand)
3. Analyser gives its reponse
     * e.g. `{ category: ‘googleCalendar’, ‘method’: create, details: {} }`
2. Check if there is a `requestId` (is the request and answer to an earlier question?)
     * if there is one check the cache and add the `parsedDetails` info to `details` before handing it over to the apiController
4. Put result in `googleCalendar` apiController and handle based on the given method and details
     * Case 1: apiController says he needs more info `(type === ‘question')`
          * e.g. `{ success: true,  type: 'question', message: 'I need a time', parsedDetails: {} }`
          * add `parsedDetails` to cache
     * Case 2: apiController says it’s done `(type === ‘response')`
          * e.g. `{ success: true,  type: 'response', message: 'Appointment Created' }` 
