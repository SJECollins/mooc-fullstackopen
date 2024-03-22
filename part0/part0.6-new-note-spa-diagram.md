## New Note SPA Diagram

[sequencediagram.org](https://sequencediagram.org/)

```
participant Browser
participant Server

title New Note SPA Diagram

    Browser->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate Server
    Browser<<--Server: 201 Created
    deactivate Server

    note right of Browser: SPA renders the new note locally
    note right of Browser: {"message":"note created"} in console

```
