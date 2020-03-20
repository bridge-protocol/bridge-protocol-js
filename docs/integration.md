---
id: integration
title: Bridge REST Integration Microservice
sidebar_label: REST Integration
---
The Bridge Integration Microservices allows for easy integration with the Bridge SDK when the target platform does not support JavaScript.  The microservice is implemented as a standalone REST interface that can be easily run in a container in any hosting environment to enable that environment to take full advantage of Bridge SDK functionality.

Source code for the integration microservice can be found in the <a href="https://github.com/bridge-protocol/bridge-protocol-integration-service/tree/ethereum-publishing">GitHub Repository</a>

## Installation and Configuration
Installing and configuring the microservice requires a few simple steps to configure the passport context and enable security for the service.
### Clone the code from the github repository
```
git clone https://github.com/bridge-protocol/bridge-protocol-integration-service.git
```

### Copy your passport file into the directory and update configuration
The integration service uses the context of a loaded passport to provide all Bridge functionality on behalf of the service.  Edit the config.json file in the /src directory to configure the passport and header security settings for the service.

```
{
    "version": "2.5",
    "serviceName": "Bridge Protocol Integration Service",
    "passportFile": "./your-passport-file.json",
    "passportPassphrase": "yourpassportpassphrase",
    "securityHeaderValue": "securityheadervalue",
    "bridgeApiBaseUrl": "https://bridgeprotocol.azurewebsites.net/api/"
}
```
- passportFile (string) - The path to the passport file to load as the service context passport
- passportPassphrase (string) - The password to unlock the passport that was provided at the time of creation
- securityHeaderValue (string) - The value to be provided in the header for all REST calls to provide security

### Run the Service
To run the service, navigate to the /src folder, install all dependencies via npm and start the service:
```
npm i && npm start
```

## Authentication
All requests to the REST service are secured by a security header.  Each request to the service will verify that the header with the security header value configured is provided in the request.  All requests should include the following headers:

```
Content-Type: application/json
securityheader: securityheadervalue
```

## Responses
All responses from an endpoint will contain an object that contains a result and error property.  If errors occured during the request the error property will contain the error message, otherwise the response property will contain the response content.

```
{ 
    response, 
    error 
}
```