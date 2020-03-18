---
id: sdk-models-passport
title: Passport
sidebar_label: Passport
---

# Properties

## publicKey

## privateKey

# Functions

## create

async create(password)

## openFile

async openFile(filePath, password)

## open

async open(passportJson, password)

## save

async save(filePath)

## export

async export()

## addWallet

async addWallet(network, password, privateKey)

## getWalletForNetwork

getWalletForNetwork(network)

## getWalletAddresses

getWalletAddresses(networks)

## getDecryptedClaim

async getDecryptedClaim(claimTypeId, password)

## getDecryptedClaims

async getDecryptedClaims(claimTypeIds, password)

## getClaimPackages

getClaimPackages(claimTypeIds)

## getClaimPackage

getClaimPackage(claimTypeId)