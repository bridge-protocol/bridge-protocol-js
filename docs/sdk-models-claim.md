---
id: sdk-models-claim
title: Claim
sidebar_label: Claim
---

constructor(claim)

# Properties

## isExpired

## isValid

# Functions

## encrypt

async encrypt(targetPublicKey, passportPrivateKey, password)

## fromClaimPackage

async fromClaimPackage(claimPackage, privateKey, password)

## getSignatureString

async getSignatureString(passportId)

## verifySignature

async verifySignature(passportId)
