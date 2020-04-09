import gql from "graphql-tag";

export const GET_PARTIES_QUERY = gql`
  query getParties {
    parties {
      name
      coverUri
      host {
        firstName
        userName
        userImage
      }
    }
  }
`;

export const GET_PARTY_QUERY = gql`
  query getParty {
    party {
      name
      coverUri
      host {
        userName
        userImage
      }
      queue {
        title
        album
        artist
        coverUri
        rating {
          user {
            userName
          }
          like
        }
      }
    }
  }
`;
