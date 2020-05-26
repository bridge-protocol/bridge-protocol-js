---
id: integration-profile
title: Profile Types
sidebar_label: Profile
---
The Profile endpoints allow for retrieval of Bridge known type definitions.

### GET /profile/types
Retrieves the type definitions for all known Profile types on the Bridge Network

##### Example Response:
```
[
    {
        "id":1,
        "name":"Age Verification Over 18",
        "description":"Age Verification Profile for 18+",
        "claimTypes":[100001]
    }
]
```
