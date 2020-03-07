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

export const SPOTIFY_REFRESH_MUTATION = gql`
  mutation refreshTokens {
    refreshTokens {
      ok
      user {
        accessToken
        refreshToken
      }
    }
  }
`;
