---
id: extension-using
title: Third-Party Interaction
sidebar_label: Third-Party Interaction
---

To use their digital identity online, users will interact with third party websites and applications in a few different ways.

### Providing Personal Information

The most common use case is for a user to provide information to requesting websites and applications.  A network partner can request information about the user attempting to login using their Bridge Passport.  This information can include personal information or blockchain addresses associated with the passport.  The user is in control of what information they choose to respond with.

<p><img class='centered' src='/img/extension/passport-login.jpg'></img></p>

### Making Bridge Token Payments

A key part of the Bridge ecosystem is the Bridge Token.  A partner site or application can request a token payment from the user.  When a request is received the blockchain the payment is requested on as well as the requesting address and amount are presented to the user so they can make the payment if they choose.

<p><img class='centered' src='/img/extension/passport-payment.jpg'></img></p>

### Importing Claims

When information about the user is verified, a Bridge Marketplace Partner will provide the user with verified claims about their identity.  In order for the user to include these claims in their digital identity, they need to be imported to their passport.  The Marketplace Partner will send a claims import request to the user, and they can optionally import any of the provided claims.

<p><img class='centered' src='/img/extension/passport-claimsimport.jpg'></img></p>