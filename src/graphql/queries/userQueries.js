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

export const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      userName
      firstName
      email
    }
  }
`;
