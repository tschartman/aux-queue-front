<template>
  <div>
    <h5 class="title">{{ party.host.userName }}'s Party</h5>
    <partyHostView
      v-if="$store.getters.user.userName === party.host.userName"
      :party="party"
      @shutDownParty="shutDownParty"
      @removeSong="removeSong"
      @refreshSong="refreshSong"
    />
    <partyView
      v-else
      :party="party"
      @removeSong="removeSong"
      @refreshSong="refreshSong"
      @suggestSong="suggestSong"
      @leaveParty="leaveParty"
      @updateQueue="updateQueue"
    />
  </div>
</template>
<script>
import {
  GET_PARTY_QUERY,
  SUGGEST_SONG_MUTATION,
  LEAVE_PARTY_MUTATION,
  SHUT_DOWN_PARTY_MUTATION,
  REFRESH_CURRENT_SONG,
  PARTY_UPDATED_SUBSCRIPTION
} from "src/graphql/queries/partyQueries";
import partyView from "components/party/partyView";
import partyHostView from "components/party/partyHostView";
const alerts = [
  {
    color: "negative",
    message: "Error occured during suggesting song",
    icon: "report_problem"
  },
  {
    color: "negative",
    message: "Error occured while leaving party",
    icon: "report_problem"
  }
];
export default {
  name: "Party",
  components: {
    partyView,
    partyHostView
  },
  props: {
    method: { type: Function }
  },
  data() {
    return {
      party: {},
      queue: []
    };
  },
  apollo: {
    party: {
      query: GET_PARTY_QUERY,
      subscribeToMore: [
        {
          document: PARTY_UPDATED_SUBSCRIPTION,
          variables() {
            return {
              id: this.party.id
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            return subscriptionData.data.partyUpdated;
          }
        }
      ]
    }
  },
  methods: {
    updateQueue(action, song) {
      const user = this.$store.getters.user;
      let queue = Array.from(this.party.queue);
      let songIndex = queue.findIndex(s => s.id === song.id);
      let ratingIndex = queue[songIndex].rating.findIndex(
        r => r.user.userName === user.userName
      );
      if (action === "likeSong" || action === "dislikeSong") {
        if (ratingIndex === -1) {
          queue[songIndex].rating.push({
            like: action === "likeSong",
            user: user
          });
        } else {
          queue[songIndex].rating[ratingIndex].like = action === "likeSong";
        }
      } else if (action === "removeRating") {
        queue[songIndex].rating.splice(ratingIndex, 1);
      }
      this.$set(this.party, "queue", queue);
    },
    async suggestSong(song) {
      let queue = Array.from(this.party.queue);
      let newSong = {
        title: song.name,
        artist: song.artists[0].name,
        album: song.album.name,
        coverUri: song.album.images[0].url,
        songUri: song.uri
      };
      //if the song is not in the queue we can continue
      if (queue.findIndex(s => s.song.songUri === newSong.songUri) === -1) {
        const suggestedSong = await this.$apollo.mutate({
          mutation: SUGGEST_SONG_MUTATION,
          variables: { input: newSong }
        });
        // if no errors occured then add then update ui to reflect changes
        if (suggestedSong.data.suggestSong.ok) {
          queue.push(suggestedSong.data.suggestSong.suggested);
          this.$set(this.party, "queue", queue);
        } else {
          // else an error has occured
          this.$q.notify(alerts[0]);
        }
      } else {
        // if song is already in queue simple remove it from my list
        this.remove(song);
      }
    },
    async refreshSong(userName) {
      const currentSong = await this.$apollo.mutate({
        mutation: REFRESH_CURRENT_SONG,
        variables: { userName: userName }
      });
      if (currentSong.data.refreshCurrentSong.ok) {
        if (this.party) {
          this.party.currentlyPlaying =
            currentSong.data.refreshCurrentSong.currentSong;
          this.$emit(
            "refreshParty",
            this.party.id,
            currentSong.data.refreshCurrentSong.currentSong
          );
        }
      }
    },
    removeSong(song) {
      let songs = Array.from(this.party.queue);
      songs = songs.filter(s => s.id !== song.id);
      this.$set(this.party, "queue", songs);
    },
    async shutDownParty() {
      const shutDownParty = await this.$apollo.mutate({
        mutation: SHUT_DOWN_PARTY_MUTATION
      });
      if (shutDownParty.data.shutDownParty.ok) {
        this.$emit("changeView");
      } else {
        this.$q.notify(alerts[1]);
      }
    },
    async leaveParty() {
      const leaveParty = await this.$apollo.mutate({
        mutation: LEAVE_PARTY_MUTATION
      });
      if (leaveParty.data.leaveParty.ok) {
        this.$emit("leaveParty");
      } else {
        this.$q.notify(alerts[1]);
      }
    }
  },
  created() {
    console.log(this.$store.getters);
  }
};
</script>
<style scoped>
.title {
  display: block;
  margin: auto;
  text-align: center;
}
</style>
