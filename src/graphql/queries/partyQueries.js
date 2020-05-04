import gql from "graphql-tag";

export const GET_PARTIES_QUERY = gql`
  query getParties {
    parties {
      id
      name
      currentlyPlaying {
        coverUri
      }
      host {
        userName
      }
    }
  }
`;

export const PARTY_CREATED_SUBSCRIPTION = gql`
  subscription partyCreated {
    partyCreated {
      id
      name
      currentlyPlaying {
        coverUri
      }
      host {
        userName
      }
    }
  }
`;

export const PARTY_DELETED_SUBSCRIPTION = gql`
  subscription partyDeleted {
    partyDeleted {
      id
    }
  }
`;

export const PARTY_UPDATED_SUBSCRIPTION = gql`
  subscription partyUpdated($id: ID!) {
    partyUpdated(id: $id) {
      name
      host {
        userName
      }
      currentlyPlaying {
        title
        artist
        album
        coverUri
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

export const GET_PARTY_QUERY = gql`
  query getParty {
    party {
      name
      host {
        userName
      }
      currentlyPlaying {
        title
        artist
        album
        coverUri
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

export const REMOVE_SONG_MUTATION = gql`
  mutation removeSong($id: ID!) {
    removeSong(input: { id: $id }) {
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

export const SHUT_DOWN_PARTY_MUTATION = gql`
  mutation shutDownParty {
    shutDownParty {
      ok
    }
  }
`;

export const REFRESH_CURRENT_SONG = gql`
  mutation refreshCurrentSong($userName: String!) {
    refreshCurrentSong(input: { userName: $userName }) {
      ok
      currentSong {
        title
        artist
        album
        coverUri
      }
    }
  }
`;

export const JOIN_PARTY_MUTATION = gql`
  mutation joinParty($userName: String!) {
    joinParty(input: { userName: $userName }) {
      ok
      party {
        id
        name
        host {
          userName
          userImage
        }
        currentlyPlaying {
          title
          artist
          album
          coverUri
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
