import gql from "graphql-tag";

export const GET_PARTIES_QUERY = gql`
  query getParties {
    parties {
      name
      host {
        userName
      }
    }
  }
`;

export const GET_PARTY_QUERY = gql`
  query getParty {
    party {
      name
      host {
        userName
      }
      queue {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
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
  mutation rateSong($id: ID!, $like: Boolean!) {
    rateSong(input: { id: $id, like: $like }) {
      ok
    }
  }
`;

export const REMOVE_RATING_MUTATION = gql`
  mutation removeRating($id: ID!) {
    removeRating(input: { id: $id }) {
      ok
    }
  }
`;

export const SUGGEST_SONG_MUTATION = gql`
  mutation suggestSong($input: SuggestSongInput!) {
    suggestSong(input: $input) {
      ok
      suggested {
        id
        song {
          title
          album
          artist
          coverUri
          songUri
        }
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

export const LEAVE_PARTY_MUTATION = gql`
  mutation leaveParty {
    leaveParty {
      ok
    }
  }
`;

export const JOIN_PARTY_MUTATION = gql`
  mutation joinParty($userName: String!) {
    joinParty(input: { userName: $userName }) {
      ok
      party {
        name
        host {
          userName
          userImage
        }
        queue {
          id
          song {
            title
            album
            artist
            coverUri
            songUri
          }
          rating {
            user {
              userName
            }
            like
          }
        }
      }
    }
  }
`;

export const CREATE_PARTY_MUTATION = gql`
  mutation createParty {
    createParty {
      ok
      party {
        name
        queue {
          id
          song {
            title
          }
        }
        host {
          userName
        }
      }
    }
  }
`;
