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
        songUri
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

export const RATE_SONG_MUTATION = gql`
  mutation rateSong($songUri: String!, $like: Boolean!) {
    rateSong(input: { songUri: $songUri, like: $like }) {
      ok
    }
  }
`;

export const REMOVE_RATING_MUTATION = gql`
  mutation removeRating($songUri: String!) {
    removeRating(input: { songUri: $songUri }) {
      ok
    }
  }
`;

export const SUGGEST_SONG_MUTATION = gql`
  mutation suggestSong($input: SuggestSongInput!) {
    suggestSong(input: $input) {
      ok
    }
  }
`;

export const LEAVE_PARTY_MUTATION = gql`
  mutation leaveParty {
    leaveParty {
      ok
    }
  }
`;

export const CREATE_PARTY_MUTATION = gql`
  mutation createParty {
    createParty {
      ok
      party {
        name
        coverUri
        queue {
          title
        }
        host {
          userName
        }
      }
    }
  }
`;
