import gql from "graphql-tag";

export const GET_FRIENDS_QUERY = gql`
  query getFriends {
    friends {
      status
      userOne {
        userName
      }
      userTwo {
        userName
      }
    }
  }
`;

export const GET_FRIEND_QUERY = gql`
  query getFriend($userName: String!) {
    friend(userName: $userName) {
      status
      userOne {
        userName
        firstName
        lastName
        accessToken
        refreshToken
      }
      userTwo {
        userName
        firstName
        lastName
        accessToken
        refreshToken
      }
    }
  }
`;
