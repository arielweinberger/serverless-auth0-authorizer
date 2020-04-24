<p align="center">
  <img src="https://codingly-assets.s3-eu-west-1.amazonaws.com/Codingly+Logo.png" width="200px" height="200px"/>
  </br>
  <a href="https://codingly.io">codingly.io</a>
  <br/>
</p>
<h1 align="center">Serverless Framework Auth0 Authorizer</h1>
<p align="center">
  <i><strong>A modern, ES6-friendly Lambda Authorizer ready for integration with Serverless Framework and Auth0.</strong></i>
  <br/>
  Based on the <a href="https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api">serverless/examples/aws-node-auth0-custom-authorizers-api</a> example.
</p>

## Features

- Test front-end application
- Private endpoint for testing
- Public endpoint for testing
- ES6-friendly

## Getting started

### 1. Clone the repository (or generate a serverless project)
```sh
sls create --name auth-service --template-url https://github.com/codingly-io/serverless-auth0-authorizer
cd auth-service
```

### 2. Install dependencies

```sh
npm install
```

### 3. Create `secret.pem` file

This file will contain your Auth0 public certificate, used to verify tokens.

Create a `secret.pem` file in the root folder of this project. Simply paste your public certificate in there.

### 4. Deploy the stack

We need to deploy the stack in order to consume the private/public testing endpoints.

```sh
sls deploy -v
```

### 5. Final test

To make sure everything works, send a POST request (using curl, Postman etc.) to your private endpoint.

You can grab a test token from Auth0. Make sure to provide your token in the headers like so:

```
"Authorization": "Bearer YOUR_TOKEN"
```

You should be good to go!

<hr/>

## Bonus: Cross-stack authorization

This is very useful in a microservices setup. For example, you have an Auth Service (this service) which owns anything auth/user-related, and a bunch of other services that require user authorization.
Fear not, it is very easy to make your authorizer work anywhere else in your AWS account.

When defining your Lambdas in other services, simply define the `authorizer` as well and provide the ARN of your `auth` function (can be found in the AWS Console or via `sls info`).

#### Example:

```yaml
functions:
  someFunction:
    handler: src/handlers/someFunction.handler
    events:
      - http:
          method: POST
          path: /something
          authorizer: arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:sls-auth-service-draft-dev-auth
```

If everything was set up correctly, all incoming requests to your `someFunction` Lambda will first be authorized. You can find the JWT claims at `event.requestContext.authorizer`.
