'use client';

import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import ChatClient from "./components/ChatClient";
import { RecoilRoot } from "recoil";
import { ProviderAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated, username, signIn, signOut } = useAuth();

  return (
    <ProviderAuth>
      <main className="flex min-h-screen flex-col items-center justify-between p-2">
        {/* <h1>hello, {username}さん</h1> */}
        {
          isAuthenticated ? (
            <button onClick={() => signOut()}>ログアウト</button>
          ) : (
            <button onClick={() => signIn()}>Okta認証でログイン</button>
          )
        }
        <RecoilRoot>
          <ChatClient />
        </RecoilRoot>

      </main>
    </ProviderAuth>
  );
}
