![Barney Awesomeness](http://static.celebuzz.com/uploads/2013/06/14/request-five.gif)

#### Introduction
We hired a new office assistant lately. I asked her to put a meeting in my calendar and invite the client to the event as well. She made a typo and as a result the client showed up too late, which is okay because she's human and humans make mistakes now and then...

But wait.. What if you could have about the same experience as with a physical someone but let a computer do all the work instead. If that would work well it could be a lot more accurate and well, a computer doesn't ask for a paystroke every month.

`Hey Sara`<br>
`Yes?`

`Sara, who are you?`<br>
`I'm Sara, your virtual office assistant`

`Sara, what can you do?`<br>
`I can do all sorts of things like planning events, control office stuff like the lights and much more. I'm also hooked up to the Wolfram API so I am also able to answer questions like "what is 2 + 2" and "what is the distance from here to the moon".`

`Sara, can you plan an event?`<br>
`What time is the event?`<br>
`2pm`<br>
`What date is the event?`<br>
`tomorrow`<br>
`Who is attending?`<br>
`Me, dave and joseph from Microsoft`<br>
`I created the following event for you`

Awesome, but how is this different from for example Siri? Well for starters its not a PA, its and office assistant. And its expandable with anything you want, so it can do more than Siri will ever be able to, like checking your bank balance.

`Sara, whats our current balance`<br>
`2 million euro's and 5 cents`

Sara, your new expendable office assistant.

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
