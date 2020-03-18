---
id: sdk-messaging-payment
title: Payment
sidebar_label: Payment 
---

# Functions

## createPaymentRequest

async createPaymentRequest(passport, password, network, amount, address, identifier)

## createPaymentResponse

async createPaymentResponse(passport, password, network, from, amount, address, identifier, transactionId, targetPublicKey)

## verifyPaymentRequest

async verifyPaymentRequest(message)

## verifyPaymentResponse

async verifyPaymentResponse(passport, password, message)