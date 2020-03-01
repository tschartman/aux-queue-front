import gql from "graphql-tag";

export const USER_DATA_QUERY = gql`
  query getUser {
    user {
      email
      firstName
      lastName
      userName
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

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
  ) {
    updateUser(
      input: { firstName: $firstName, lastName: $lastName, email: $email }
    ) {
      ok
      user {
        firstName
        lastName
        email
        userName
      }
    }
  }
`;

export const UPDATE_USER_NAME_MUTATION = gql`
  mutation updateUserName($userName: String!) {
    updateUserName(input: { userName: $userName }) {
      ok
      userName
    }
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation updatePassword($oldPass: String!, $newPass: String!) {
    updatePassword(input: { oldPass: $oldPass, newPass: $newPass }) {
      ok
      error
    }
  }
`;

export const CHECK_USER_MUTATION = gql`
  mutation checkUserName($userName: String!) {
    checkUserName(input: { userName: $userName }) {
      ok
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      userName
      firstName
      email
    }
  }
`;

export const GET_RND_USER_NAME = gql`
  query getUserName {
    userName
  }
`;
