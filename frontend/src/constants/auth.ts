// https://qiita.com/gossan/items/074b1cc4653ab0be7e43
// https://qiita.com/gossan/items/c2352c6696c9527f1327
// https://repost.aws/ja/knowledge-center/cognito-okta-saml-identity-provider
// https://dev.classmethod.jp/articles/aws-cdk-alb-cognito-okta-saml-authentication/

import { ResourcesConfig } from "aws-amplify";

const cognitoRegion = process.env.NEXT_PUBLIC_COGNITO_REGION || 'ap-northeast-1';
const cognitoUserPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const cognitoUserPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "";

const cognitoDomainPrefix = process.env.NEXT_PUBLIC_COGNITO_DOMAIN_PREFIX;

const authConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: cognitoUserPoolId,
      userPoolClientId: cognitoUserPoolClientId,
      loginWith: {
        oauth: {
          domain: `${cognitoDomainPrefix}.auth.${cognitoRegion}.amazoncognito.com`,
          scopes: ['openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [
            'http://localhost:3000'
          ],
          redirectSignOut: [
            'http://localhost:3000'
          ],
          responseType: 'code',
        },
      },
      signUpVerificationMethod: 'code',
    }
  }
};

export default authConfig;
