import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  ssrMode: typeof window === "undefined", // true on server
  link: new HttpLink({
    uri: "https://api.escuelajs.co/graphql", // Replace with your API
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export default client;
