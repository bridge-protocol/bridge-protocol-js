---
id: bridge-claim
title: Bridge Verified Claim
sidebar_label: Bridge Verified Claim
---

# Claim
A claim contains a piece of information about the passport that was issued by a another passport.  These are the un-encrypted versions of the claim that are only readable and transmittable by the passport they were issued for.

<img src='https://github.com/bridge-protocol/bridge-protocol-js/blob/ethereum-publishing/docs/images/model-claim.jpg?raw=true'></img>

# Bridge Verified Claims
Bridge Verified Claims add a layer of trust since they add the requirement of being issued by a known Bridge Marketplace provider. Bridge Network Partners can verify the signature and retrieve the issuing passport information to ensure it was issued by a trusted entity with good standing on the network.  Only Bridge Verified Claims may be written to on-chain blockchain storage.
