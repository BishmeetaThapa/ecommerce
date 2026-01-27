"use client"; // make sure this file is client-side

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

export default function RootLayout({ children }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
