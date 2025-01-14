"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { UserContext } from "@/context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Provider({ children }) {
  const [messages, setMessages] = React.useState();
  const [userDetail, setUserDetail] = React.useState();

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <UserContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </NextThemesProvider>
          </MessagesContext.Provider>
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}
