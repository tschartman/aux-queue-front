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
