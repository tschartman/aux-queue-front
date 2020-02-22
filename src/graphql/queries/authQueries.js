import gql from "graphql-tag";

export const TOKEN_AUTH_MUTATION = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

export const SPOTIFY_AUTH_QUERY = gql`
  query getSpotifyAuth {
    user {
      accessToken
      refreshToken
    }
  }
`;

export const SPOTIFY_AUTH_MUTATION = gql`
  mutation updateTokens($accessToken: String!, $refreshToken: String!) {
    updateTokens(
      input: { accessToken: $accessToken, refreshToken: $refreshToken }
    ) {
      ok
    }
  }
`;

export const USER_CREATION_MUTATON = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      input: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      ok
    }
  }
`;
