import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";

import CryptoJS from 'crypto-js'

const httpLink = new HttpLink({ uri: process.env.GRAPHQL_SERVER });

const authLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  console.log(headers)

  // Retrieve the authorization token from local storage.
  const token = CryptoJS.AES.encrypt('localhost:5000', '123').toString();
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const graphQLClient = new ApolloClient({
  cache: new InMemoryCache(),
  ssrMode: true,
  link: authLink.concat(httpLink),
});

const newAuthLink = (domain) => new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = CryptoJS.AES.encrypt(domain, '123').toString();
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const newGraphQLClient = (domain) => {
  console.log('HELLLOOOO ')
  console.log(domain)
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: true,
    link: newAuthLink(domain).concat(httpLink),
  });
}