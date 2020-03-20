---
id: integration-index
title: Claim and Profile Type
sidebar_label: Claim and Profile Type
---
The Claim and Profile endpoints allow for retrieval of Bridge known type definitions.

## GET /claim/types
Retrieves the type definitions for all known Claim types on the Bridge Network

```
[
    {
        "id":1,
        "name":"First Name",
        "description":"Owner first name",
        "dataType":"string",
        "scope":"private",
        "defaultExpirationDays":0
    }
]
```

---

## GET /profile/types
Retrieves the type definitions for all known Profile types on the Bridge Network
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
