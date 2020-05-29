---
id: extension-using
title: Third-Party Interaction
sidebar_label: Third-Party Interaction
---

To use their digital identity online, users will interact with third party websites and applications in a few different ways.

### Providing Personal Information

The most common use case is for a user to provide information to requesting websites and applications.  A network partner can request information about the user attempting to login using their Bridge Passport.  This information can include personal information or blockchain addresses associated with the passport.  When a login request is received, a dialog will be displayed showing the information being requested and the sender of the request.The claims and addresses to be sent is opt-in and at the discretion of the user.

<p><img class='centered' src='/img/extension/passport-login.jpg'></img></p>

### Making Bridge Token Payments

A key part of the Bridge ecosystem is the Bridge Token.  A partner site or application can request a token payment from the user.  When a request is received the blockchain the payment is requested on as well as the requesting address and amount are presented to the user so they can make the payment if they choose.

<p><img class='centered' src='/img/extension/passport-payment.jpg'></img></p>

### Importing Claims

When information about the user is verified, a Bridge Marketplace Partner will provide the user with verified claims about their identity.  In order for the user to include these claims in their digital identity, they need to be imported to their passport.  The Marketplace Partner will send a claims import request to the user.

<p><img class='centered' src='/img/extension/passport-claimsimport.jpg'></img></p>

When a claims import request is received, a dialog will be displayed by the passport to allow the user to choose which
claims should be imported to the passport. The user simply selects which claims to import and the digital identity area will reflect the new imported claims in the passport.

**NOTE:** You can only have a single verified claim of each Bridge Protocol claim type in your passport. Any existing claims
of the same type will be overwritten with the new claim.

**PROTIP:** This is an important time to back up your Bridge Passport so you have your verified claims you just imported
backed up. In some cases you can go back to the Bridge Marketplace Partner site and re-import the claims, but that is at
the discretion of each partner whether or not they make the claims available in the future.