'use client';

import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import authConfig from "../api/auth/auth";

Amplify.configure(authConfig);

const getAuthenticatedUser = async () => {
  const {
    username,
    signInDetails: authenticationFlowType
  } = await getCurrentUser();

  const { tokens: session } = await fetchAuthSession();

  return {
    username,
    session,
    authenticationFlowType,
  };
};

const handleSignIn = () => {
  signInWithRedirect();
}
const handleSignOut = async () => {
  await signOut();
}

const useProviderAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('ゲスト');
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const data = async () => {
      const result = await getAuthenticatedUser();
      setUser(result.username);
      setUsername(result.username);
      setIsAuthenticated(true);
      setIsLoading(false);
    };

  }, []);


  const signIn = () => {
    handleSignIn();
  }

  const signOut = async () => {
    await handleSignOut();
    setUsername("");
    setIsAuthenticated(false);
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    username,
    signIn,
    signOut,
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  username: string;
  signIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "Guest",
  signIn: handleSignIn,
  signOut: handleSignOut,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProviderAuth = ({ children }: { children: any }) => {
  const auth = useProviderAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

