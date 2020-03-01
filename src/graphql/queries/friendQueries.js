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
