---
id: sdk-examples
title: Code Examples
sidebar_label: Examples
---
There are several code examples for the most common use cases included in the <a href="https://github.com/bridge-protocol/bridge-protocol-js/tree/master/examples">GitHub Repository</a>

##

### Create a New Passport
<p class="nobottommargin">
This example will demonstrate how to create a new Bridge Passport with generated private / public keys and optionally create or import blockchain wallets.  
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/passport-create.js">View Example on GitHub</a>

##

### Loading Existing Passports
<p class="nobottommargin">
Once created and exported, this example demonstrates how to import and load an existing passport from disk.
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/passport-load.js">View Example on GitHub</a>

##

### Creating Signed and Encrypted Claim Packages
<p class="nobottommargin">
For Bridge verification partners or for third parties wishing to issue their own signed claims for other passports, this example demonstrates how to create a claim and create signed and encrypted claim packages for transmission to the target passport. Note: Only claims issued by Bridge verification partners with known claim types are considered Bridge Verified Claims.
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/claims-create.js">View Example on GitHub</a>

##

### Passport to Passport Claims Import
<p class="nobottommargin">
Once secure claim packages are created, they need to be transmitted to the target passport and the target passport must import those claims so they can be included in the passport.  This example demonstrates how to create a claims import request from the claims issuing passport and send it to a target passport that will then verify the request and included claims and import those claims to the passport.
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/claims-import.js">View Example on GitHub</a>

##

##

### Passport to Passport Authentication
<p class="nobottommargin">
When a passport wants to request information about another passport to be used for Authentication or Authorization purposes, This example will demonstrate the authentication workflow is used to facilitate the challenge and response between passports.   
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/authentication.js">View Example on GitHub</a>

##

### Passport to Passport Payments
<p class="nobottommargin">
When a passport wants to request payment in BRDG a request needs to be made for the receiving passport to send payment via blockchain that needs to then be validated by the requesting passport that it was sent and that the transaction completed successfully.  This example demonstrates the payment request workflow to request and send payment between two passports.
</p>
<a href="https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/examples/payment.js">View Example on GitHub</a>




