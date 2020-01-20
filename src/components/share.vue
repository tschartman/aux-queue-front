<template>
  <div>
    <div>
      <h4 class="title">{{ user }}'s Queue</h4>
      <div class="row">
        <div class="col-xs-8 q-pa-md">
          <q-select
            rounded
            outlined
            v-model="model"
            label="Search Songs"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options"
            @filter="filterFn"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                v-on:click="addToQueue(scope.opt)"
                clickable
                v-close-popup
              >
                <q-item-section avatar>
                  <q-img :src="scope.opt.album.images[0].url" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.name" />
                  <q-item-label caption>{{
                    scope.opt.artists[0].name
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-4 q-pa-lg">
          <q-btn color="black" label="Submit" @click="addSongs" />
        </div>
      </div>
      <hr />
      <q-list>
        <q-item-label header>Queue</q-item-label>
        <q-item v-for="song in queue" :key="song.name" clickable v-ripple>
          <q-item-section avatar>
            <q-img :src="song.album.images[0].url" />
          </q-item-section>
          <q-item-section>{{ song.name }}</q-item-section>
          <q-item-section avatar>
            <q-icon @click="remove(song)" name="delete" />
          </q-item-section>
        </q-item>
      </q-list>
      <hr />
      <q-list>
        <q-item-label header>Playlist</q-item-label>
        <q-item v-for="song in playlist" :key="song.name" clickable v-ripple>
          <q-item-section avatar>
            <q-img :src="song.track.album.images[0].url" />
          </q-item-section>

          <q-item-section>{{ song.track.name }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import {
  QSelect,
  QBtn,
  QItem,
  QImg,
  QIcon,
  QList,
  QItemSection,
  QItemLabel
} from "quasar";
Vue.component("Share");

export default {
  name: "Share",
  components: {
    QSelect,
    QItem,
    QImg,
    QList,
    QItemSection,
    QItemLabel,
    QBtn,
    QIcon
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
      baseURL: "https://api.spotify.com/v1"
    };
  },

  computed: {
    currentPlaylist: function() {
      return this.$store.state.playlistId;
    }
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
        console.log(this.currentPlaylist);
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
            .then(res => (this.playlist = res.data.items));
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
      this.init();
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
