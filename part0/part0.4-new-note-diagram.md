## New Note Diagram

[sequencediagram.org](https://sequencediagram.org/)

```
participant Browser
participant Server

title New Note Diagram

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/notes
    activate Server
    Browser<<--Server: 302 Found (redirects)
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate Server
    Browser<<--Server: HTML document
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Browser<<--Server: CSS file
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate Server
    Browser<<--Server: JavaScript file
    deactivate Server

    note right of Browser: Browser starts executing JS code fetching JSON from Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Browser<<--Server: [{content: "hello", date: "2024-03-08T15:19:27.718Z"},…]
    deactivate Server

    note right of Browser: Browser executes callback function that renders notes
```
