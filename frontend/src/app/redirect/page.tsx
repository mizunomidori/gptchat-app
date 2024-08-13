import { useEffect, useState } from 'react';
import {
  AuthTokens,
  fetchAuthSession,
  getCurrentUser
} from 'aws-amplify/auth';
import { AuthFlowType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import Loading from '../components/Loading';

const getAuthenticatedUser = async () => {
  const {
    username,
    signInDetails
  } = await getCurrentUser();

  const {
    tokens: session
  } = await fetchAuthSession();

  // Note that session will no longer contain refreshToken and clockDrift
  return {
    username,
    session,
    authenticationFlowType: signInDetails?.authFlowType
  };
}

export type UserType = {
  username: string;
  session: AuthTokens | undefined;
  authenticationFlowType: AuthFlowType | undefined;
};

export default function Redirect() {
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await getAuthenticatedUser();
        setUser(user);
        console.log('User is signed in');

      } catch (error) {
        console.log(error);
      }
    };

    checkAuthState();
  }, []);

  return (
    // アプリケーションのコンポーネントをここに追加
    <main>
      <h1>hello, {user?.username}さん</h1>
      <div className="flex self-start px-8 py-2">
        <Loading />
      </div>
    </main>
  );
}
