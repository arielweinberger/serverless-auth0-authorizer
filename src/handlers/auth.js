import jwt from 'jsonwebtoken';

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

const generatePolicy = (principalId, resource) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource,
        },
      ],
    },
  };
};

export async function handler(event) {
  if (!event.authorizationToken) {
    throw 'Unauthorized';
  }

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = await jwt.verify(token, AUTH0_CLIENT_PUBLIC_KEY, { audience: AUTH0_CLIENT_ID });
    const policy = generatePolicy(claims.sub, event.methodArn);
    return {
      ...policy,
      context: claims
    }
  } catch (error) {
    console.log(error);
    throw 'Unauthorized';
  }
};