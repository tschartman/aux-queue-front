<template>
  <div>
    <div>
      <h4 class="title">{{ name }}</h4>
      <div class="row">
        <div class="col-xs-12 q-pa-md">
          <sharedSearchContainer :config="config" @selectSong="addToQueue" />
        </div>
      </div>
      <div class="row justify-center items-center">
        <q-btn flat color="black" label="Add All" @click="addSongs" />
      </div>
      <hr />
      <q-item-label header>Queue</q-item-label>
      <songList
        :action="true"
        :songs="queue"
        @deleteAction="remove"
        @postAction="addSong"
      />
      <hr />
      <q-item-label header>{{ name }}</q-item-label>
      <songList :action="false" :songs="playlist" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import sharedSearchContainer from "components/songs/searchContainer";
import songList from "components/songs/songList";
import { QBtn, QItemLabel } from "quasar";
Vue.component("Share");

export default {
  name: "Share",
  components: {
    QItemLabel,
    QBtn,
    sharedSearchContainer,
    songList
  },
  data() {
    return {
      model: null,
      user: null,
      options: [],
      queue: [],
      playlist: [],
      category: null,
      categories: ["artist", "track", "album"],
      config: {},
      baseURL: "https://api.spotify.com/v1",
      currentPlaylist: null
    };
  },

  methods: {
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
    addSongs() {
      let uris = [];
      this.queue.map(track => {
        uris.push(track.uri);
      });

      if (this.queue.length > 0) {
        axios
          .post(
            this.baseURL + "/playlists/" + this.currentPlaylist + "/tracks",
            {
              uris: uris
            },
            this.config
          )
          .then(res => {
            if (res.status == 201) {
              this.queue = [];
              this.init();
            }
          });
      }
    },
    init() {
      axios
        .get(this.baseURL + "/me", this.config)
        .then(res => {
          this.user = res.data.display_name;
          axios
            .get(
              this.baseURL + "/playlists/" + this.currentPlaylist + "/tracks",
              this.config
            )
            .then(
              res =>
                (this.playlist = res.data.items.map(item => {
                  return item.track;
                }))
            );
        })
        .catch(error => {
          if (error.status === 401) console.log(error);
          this.$router.push("/login");
        });
    },
    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        axios
          .get(this.baseURL + "/search?q=" + val + "&type=track", this.config)
          .then(res => (this.options = res.data.tracks.items));
      });
    }
  },

  created() {
    if (this.$route.query.code) {
      this.config = {
        headers: {
          Authorization: "Bearer " + this.$route.query.code
        }
      };

      this.currentPlaylist = this.$route.query.playlist;
      this.name = this.$route.query.name;
      this.init();
    } else {
      this.$router.push("/login");
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
