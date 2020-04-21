<template>
  <div>
    <h4 class="title">Parties</h4>
    <div v-if="party">
      <q-pull-to-refresh @refresh="pullRefresh">
        <partyHostView
          @shutDownParty="shutDownParty"
          v-if="$store.getters.user.userName === party.host.userName"
          :party="party"
        />
        <partyView
          v-else
          :party="party"
          @suggestSong="suggestSong"
          @leaveParty="leaveParty"
          @updateQueue="updateQueue"
        />
      </q-pull-to-refresh>
    </div>
    <div v-else class="row justify-center" q-ma-md>
      <div class="row justify-center" q-ma-md>
        <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
      </div>
      <followingParties
        @refresh="refresh"
        @joinParty="joinParty"
        :parties="parties"
      />
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
  CREATE_PARTY_MUTATION,
  SHUT_DOWN_PARTY_MUTATION,
  REFRESH_CURRENT_SONG
} from "src/graphql/queries/partyQueries";
import followingParties from "components/followingParties";
import partyView from "components/partyView";
import partyHostView from "components/partyHostView";
import { QPullToRefresh } from "quasar";
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
    partyView,
    followingParties,
    partyHostView,
    QPullToRefresh
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
    async suggestSong(song) {
      console.log(song);
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
    },
    async shutDownParty() {
      const shutDownParty = await this.$apollo.mutate({
        mutation: SHUT_DOWN_PARTY_MUTATION
      });
      if (shutDownParty.data.shutDownParty.ok) {
        this.$set(this, "party", null);
      } else {
        this.$q.notify(alerts[1]);
      }
    },
    pullRefresh(done) {
      this.refresh(this.party.host.userName);
      done();
    },
    async refresh(userName) {
      const currentSong = await this.$apollo.mutate({
        mutation: REFRESH_CURRENT_SONG,
        variables: { userName: userName }
      });
      if (currentSong.data.refreshCurrentSong.ok) {
        if (this.party) {
          this.party.currentlyPlaying =
            currentSong.data.refreshCurrentSong.currentSong;
        }
        let parties = Array.from(this.parties);
        let partyIndex = parties.findIndex(p => p.host.userName === userName);
        if (partyIndex !== -1) {
          parties[partyIndex].currentlyPlaying =
            currentSong.data.refreshCurrentSong.currentSong;
          this.parties = parties;
        }
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
