export default () => ({
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
    cognitoJwtSecret: process.env.COGNITO_JWT_SECRET,
  },
});