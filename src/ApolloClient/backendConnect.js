// import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";


// const token = localStorage.getItem("token"); 
// console.log('local storage in apollo client',token)

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:4000/graphql",
//     headers: token ? { Authorization: `Bearer ${token}` } : {}, 
//   }),
//   cache: new InMemoryCache(),
// });

// const ApolloWrapper = ({ children }) => {
//   return <ApolloProvider client={client}>{children}</ApolloProvider>;
// };

// export default ApolloWrapper;

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // Get the latest token from localStorage
  const token = localStorage.getItem("token");
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
