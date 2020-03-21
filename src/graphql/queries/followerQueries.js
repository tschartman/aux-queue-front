import gql from "graphql-tag";

export const GET_FOLLOWERS_QUERY = gql`
  query getFollowers {
    followers {
      status
      follower {
        userName
        firstName
        lastName
        email
        accessToken
      }
    }
  }
`;

export const GET_FOLLOWING_QUERY = gql`
  query getFollowing {
    following {
      status
      following {
        userName
        firstName
        lastName
        email
        accessToken
      }
    }
  }
`;

export const SEND_FOLLOW_MUTATION = gql`
  mutation sendFollowRequest($userName: String!) {
    sendFollowRequest(input: { userName: $userName }) {
      ok
    }
  }
`;

export const UPDATE_FOLLOW_MUTATION = gql`
  mutation UpdateFollowRequest($userName: String!, $status: String!) {
    updateFollowRequest(input: { userName: $userName, status: $status }) {
      ok
    }
  }
`;

export const REMOVE_FOLLOW_MUTATION = gql`
  mutation RemoveFollowRequest($userName: String!) {
    removeFollowRequest(input: { userName: $userName }) {
      ok
    }
  }
`;

export const REMOVE_FOLLOWER_MUTATION = gql`
  mutation RemoveFollowerRequest($userName: String!) {
    removeFollowerRequest(input: { userName: $userName }) {
      ok
    }
  }
`;
