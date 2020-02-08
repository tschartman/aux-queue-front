<template>
  <div>
    <h4 class="title">{{ user }}'s Queue</h4>
    <div class="row">
      <div class="col-xs-12 q-pa-md">
        <songSearch @selectSong="addToQueue" />
      </div>
    </div>
    <hr />
    <div class="row">
      <q-item-label header>Queue</q-item-label>
      <q-item-section avatar>
        <q-icon @click="playAll()" name="arrow_upward" />
      </q-item-section>
    </div>
    <songList
      :action="true"
      :songs="queue"
      @deleteAction="remove"
      @postAction="playNow"
    />
    <hr />
    <sharedPlaybackContainer
      ref="child"
      :auth="false"
      @setUser="setUser"
      @remove="remove"
      @removeAll="removeAll"
    />
  </div>
</template>
<script>
import songSearch from "components/songSearch";
import songList from "components/songList";
import sharedPlaybackContainer from "components/sharedPlaybackContainer";
import { QIcon, QItemSection, QItemLabel } from "quasar";

export default {
  name: "shareQueue",
  components: {
    QItemSection,
    QItemLabel,
    QIcon,
    songSearch,
    songList,
    sharedPlaybackContainer
  },
  data() {
    return {
      user: "",
      queue: []
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
    },
    setUser(user) {
      this.user = user;
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

.progress {
  max-width: 55%;
}
</style>
