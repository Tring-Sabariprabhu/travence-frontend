import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { makeToast } from "../../Components/Toast/makeToast";


const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
});
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for(const err of graphQLErrors){
      if(err?.message.includes("jwt expired") || err?.message?.includes("TokenExpiredError")){
        makeToast({message: "Session expired", toastType: "info"});
        setTimeout(()=>{
          localStorage.removeItem("token");
          window.location.href="/signin";
        }, 2000);
      }
    }
  }
});



const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

interface ApolloWrapperProps {
  children: React.ReactNode;
}

const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloWrapper;
