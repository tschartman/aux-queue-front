<template>
  <div>
    <h4 class="title">Parties</h4>
    <div class="q-pa-md">
      <searchContainer @selectSong="addToMySongList" />
    </div>
    <div class="row justify-center" q-ma-md>
      <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
    </div>
    <hr />
    <q-item-label header>My Song List</q-item-label>
    <songList
      :action="true"
      :songs="queue"
      @postAction="suggestSong"
      @deleteAction="remove"
    />
    <hr />
    <partyView
      v-if="party"
      :party="party"
      @leaveParty="leaveParty"
      @updateQueue="updateQueue"
    />
    <div v-else class="row justify-center" q-ma-md>
      <followingParties @joinParty="joinParty" :parties="parties" />
    </div>
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  GET_PARTY_QUERY,
  SUGGEST_SONG_MUTATION,
  LEAVE_PARTY_MUTATION,
  JOIN_PARTY_MUTATION,
  CREATE_PARTY_MUTATION
} from "src/graphql/queries/partyQueries";
import searchContainer from "components/searchContainer";
import songList from "components/songList";
import followingParties from "components/followingParties";
import partyView from "components/partyView";
import { QItemLabel } from "quasar";
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
  },
  {
    color: "negative",
    message: "Error occured creating party",
    icon: "report_problem"
  },
  {
    color: "negative",
    message: "Error occured joining party",
    icon: "report_problem"
  }
];
export default {
  name: "Queue",
  components: {
    QItemLabel,
    searchContainer,
    songList,
    partyView,
    followingParties
  },
  data() {
    return {
      parties: [],
      queue: [],
      party: null
    };
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
    addToMySongList(newSong) {
      if (this.queue.some(song => song.id === newSong.id)) {
        return;
      } else {
        this.queue.push(newSong);
      }
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
          this.remove(song);
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
    async joinParty(userName) {
      const joinParty = await this.$apollo.mutate({
        mutation: JOIN_PARTY_MUTATION,
        variables: { userName: userName }
      });
      if (joinParty.data.joinParty.ok) {
        this.party = joinParty.data.joinParty.party;
      } else {
        this.$q.notify(alerts[3]);
      }
    },
    async startParty() {
      const createParty = await this.$apollo.mutate({
        mutation: CREATE_PARTY_MUTATION
      });
      if (createParty.data.createParty.ok) {
        this.party = createParty.data.createParty.party;
      } else {
        this.$q.notify(alerts[2]);
      }
    },
    remove(song) {
      let index = this.queue.indexOf(song);
      this.queue.splice(index, 1);
    },
    async leaveParty() {
      const leaveParty = await this.$apollo.mutate({
        mutation: LEAVE_PARTY_MUTATION
      });
      if (leaveParty.data.leaveParty.ok) {
        this.$set(this, "party", null);
      } else {
        this.$q.notify(alerts[1]);
      }
    }
  },
  async created() {
    const party = await this.$apollo.query({
      query: GET_PARTY_QUERY
    });
    const parties = await this.$apollo.query({
      query: GET_PARTIES_QUERY
    });
    this.parties = parties.data.parties;
    this.party = party.data.party;
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
