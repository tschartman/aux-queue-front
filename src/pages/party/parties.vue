<template>
  <div>
    <h4 class="title">Parties</h4>
    <div class="q-pa-md">
      <searchContainer @selectSong="addToMySongList" />
    </div>
    <div class="row justify-center" q-ma-md>
      <q-btn flat color="primary">Start One!</q-btn>
    </div>
    <hr />
    <q-item-label header>My Song List</q-item-label>
    <songList :action="true" :songs="queue" @deleteAction="remove" />
    <hr />
    <partyView v-if="party" :party="party" @updateQueue="updateQueue" />
    <h6 class="title" v-else>You are not in a party</h6>
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  GET_PARTY_QUERY
} from "src/graphql/queries/partyQueries";
import searchContainer from "components/searchContainer";
import songList from "components/songList";
import partyView from "components/partyView";
import { QItemLabel } from "quasar";
export default {
  name: "Queue",
  components: {
    QItemLabel,
    searchContainer,
    songList,
    partyView
  },
  data() {
    return {
      parties: [],
      queue: [],
      party: {}
    };
  },
  computed: {},
  methods: {
    updateQueue(action, song) {
      const user = this.$store.getters.user;
      let queue = Array.from(this.party.queue);
      let songIndex = queue.findIndex(s => s.songUri === song.songUri);
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
    remove(song) {
      let index = this.queue.indexOf(song);
      this.queue.splice(index, 1);
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
