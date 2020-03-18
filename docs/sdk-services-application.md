---
id: sdk-services-application
title: Application
sidebar_label: Application
---
Service to manage the lifecycle of verification requests on the Bridge Network

## Functions
### getActiveApplications()
```
async getActiveApplications(passport, passphrase)
```

### getAllApplications()
```
async getAllApplications(passport, passphrase)
```

### getApplication()
```
async getApplication(passport, passphrase, applicationId)
```

### createApplication()
```
async createApplication(passport, passphrase, partner)
```

### updatePaymentTransaction()
```
async updatePaymentTransaction(passport, passphrase, applicationId, network, transactionId)
```

### retrySend()
```
async retrySend(passport, passphrase, applicationId)
```

### getStatus()
```
async getStatus(passport, passphrase, applicationId)
```