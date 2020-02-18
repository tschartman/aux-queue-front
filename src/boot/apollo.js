import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import { createHttpLink } from "apollo-link-http";

const httpLink = createHttpLink({ uri: "http://localhost:8000/graphql/" });

// Create a new Middleware Link using setContext
const middlewareLink = setContext(() => ({
  headers: {
    Authorization: `JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRzY2hhcnRtYW5AeWFob28uY29tIiwiZXhwIjoxNTgxOTk0NTkwLCJvcmlnSWF0IjoxNTgxOTk0MjkwfQ.nYsCB6Aki2tHL-2A1QqiJWMz5yLUvfzYtvh3Rd9Exww`
  }
}));

// Create the apollo client
const apolloClient = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler({ graphQLErrors, networkError }) {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
});

export default ({ app, Vue }) => {
  Vue.use(VueApollo);
  app.apolloProvider = apolloProvider;
};
