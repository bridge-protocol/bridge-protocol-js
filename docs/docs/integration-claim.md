---
id: integration-claim
title: Claim
sidebar_label: Claim
---
The claim endpoints exposes functionality to retrieve claim type information and verifying claims


### GET /claim/types
Retrieves the type definitions for all known Claim types on the Bridge Network

##### Example Response:

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

### POST /claim//verifysignature
Verifies the signature of the provided claim

- **passportId** (string) - the passport the claim was signed for
- **claim** (<a href='sdk-models-claim'>Claim</a>) - the claim to verify

##### Example Response:
```
    {
        "result": true
    }
```