---
id: sdk-messaging-auth
title: Auth
sidebar_label: Auth 
---

# Functions

## createPassportChallengeRequest

async createPassportChallengeRequest(passport, password, token, claimTypes, networks)

## createPassportChallengeResponse

async createPassportChallengeResponse(passport, password, targetPublicKey, token, claims, networks)

## verifyPassportChallengeRequest

async verifyPassportChallengeRequest(message) 

## verifyPassportChallengeResponse

async verifyPassportChallengeResponse(passport, password, message, verifyToken, claimTypeIds, networks)