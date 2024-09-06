
import * as jwt from 'jsonwebtoken';
import base64Url from 'base64url';
import jws from 'jws';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

async function getJwtPayload(headerList: ReadonlyHeaders) {
  const awsRegion = 'ap-northeast-1';
  console.log(headerList.get('host'));

  const encodedJwt = headerList.get('x-amzn-oidc-data');

  if (encodedJwt) {
    const base64UrlToken = base64Url.fromBase64(encodedJwt);
    const decoded = jwt.decode(base64UrlToken, { complete: true });

    if (!decoded) {
      return null;
    }

    const { kid } = decoded.header;

    const url =`https://public-keys.auth.elb.${awsRegion}.amazonaws.com/${kid}`;

    const response = await fetch(url);
    const key = await response.text();

    try {
      const verify = jws.verify(encodedJwt, 'ES256', key);
      if (!verify) {
        console.log('JWT signature not verified.');
        return null;
      }

      return encodedJwt;
    } catch (err) {
      throw err;
    }
  } else {
    return null;
  }
}

export const getHeadersData = async (headerList: ReadonlyHeaders) => {
  const encodedJwt = await getJwtPayload(headerList);

  if (!encodedJwt) {
    return null;
  } else {
    const jwtEncodedTokenList = encodedJwt.split('.');
    const jwtEncodedHeaders = jwtEncodedTokenList[0];
    const jwtEncodedPayload = jwtEncodedTokenList[1];
    const jwtEncodedSignature = jwtEncodedTokenList[2];
    const jwtDecodedHeaders = Buffer.from(jwtEncodedHeaders, 'base64').toString('binary');
    const jwtPayload = Buffer.from(jwtEncodedPayload, 'base64').toString('binary');

    const jwtParsed = JSON.parse(jwtPayload);
    const jwtUsername = jwtParsed.username;
    const jwtEmail = jwtParsed.email;
  }
};
