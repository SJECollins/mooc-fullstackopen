## SPA Diagram

[sequencediagram.org](https://sequencediagram.org/)

```
participant Browser
participant Server

title SPA Diagram

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/spa
    activate Server
    Browser<<--Server: HTML document
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Browser<<--Server: CSS file
    deactivate Server

    Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
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
