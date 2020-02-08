<template>
  <div>
    <div>
      <h4 class="title">My Queue</h4>
      <div class="row">
        <div class="col-xs-12 q-pa-md">
          <searchContainer @selectSong="addToQueue" />
        </div>
      </div>
      <div class="row justify-center items-center">
        <q-btn v-on:click="share = true" label="Share" flat />
      </div>
      <q-dialog v-model="share">
        <shareQueue />
      </q-dialog>
      <hr />
      <div class="row">
        <q-item-label header>Queue</q-item-label>
        <q-item-section avatar>
          <q-icon @click="$refs.child.playAll(queue)" name="arrow_upward" />
        </q-item-section>
      </div>
      <songList
        :action="true"
        :songs="queue"
        @deleteAction="remove"
        @postAction="playNow"
      />
      <hr />
      <playbackContainer
        ref="child"
        :auth="true"
        @remove="remove"
        @removeAll="removeAll"
      />
    </div>
  </div>
</template>
<script>
import shareQueue from "src/modals/shareQueue";
import searchContainer from "components/searchContainer";
import songList from "components/songList";
import playbackContainer from "components/playbackContainer";
import { QBtn, QItemSection, QItemLabel } from "quasar";

export default {
  name: "Queue",
  components: {
    QItemSection,
    QItemLabel,
    QBtn,
    shareQueue,
    searchContainer,
    songList,
    playbackContainer
  },
  data() {
    return {
      queue: [],
      share: false,
      api: "test"
    };
  },
  computed: {},
  methods: {
    playNow(song) {
      this.$refs.child.playNow(song);
    },
    addToQueue(newSong) {
      if (this.queue.some(song => song.id === newSong.id)) {
        return;
      } else {
        this.queue.push(newSong);
      }
    },
    remove(song) {
      let index = this.queue.indexOf(song);
      this.queue.splice(index, 1);
    },
    removeAll() {
      this.queue = [];
    }
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
