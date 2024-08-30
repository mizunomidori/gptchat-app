// https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/listener-authenticate-users.html
// https://zenn.dev/bun913/articles/alb-cognito-auth
// https://gist.github.com/noid11/674297aa79a89e654d6390e7c3cefc22

import { ResourcesConfig } from "aws-amplify";

const cognitoRegion = process.env.COGNITO_REGION;
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID || "";
const cognitoUserPoolClientId = process.env.COGNITO_USER_POOL_CLIENT || "";

const cognitoDomainPrefix = process.env.COGNITO_DOMAIN_PREFIX;

const authConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: cognitoUserPoolId,
      userPoolClientId: cognitoUserPoolClientId,
      loginWith: {
        oauth: {
          domain: `${cognitoDomainPrefix}.auth.${cognitoRegion}.amazoncognito.com`,
          scopes: ['openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: ['http://localhost:3000'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'code',
        }
      }
    }
  }

};

export default authConfig;
