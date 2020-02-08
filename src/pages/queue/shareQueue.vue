<template>
  <div>
    <h4 class="title">{{ user }}'s Queue</h4>
    <div class="row">
      <div class="col-xs-12 q-pa-md">
        <sharedSearchContainer :config="config" @selectSong="addToQueue" />
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
      @setParent="setParent"
      @remove="remove"
      @removeAll="removeAll"
    />
  </div>
</template>
<script>
import songList from "components/songList";
import sharedSearchContainer from "components/sharedSearchContainer";
import sharedPlaybackContainer from "components/sharedPlaybackContainer";
import { QIcon, QItemSection, QItemLabel } from "quasar";

export default {
  name: "shareQueue",
  components: {
    QItemSection,
    QItemLabel,
    QIcon,
    sharedSearchContainer,
    songList,
    sharedPlaybackContainer
  },
  data() {
    return {
      user: "",
      queue: [],
      config: {}
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
    setParent(user, config) {
      this.user = user;
      this.config = config;
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
