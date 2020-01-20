<template>
  <div>
    <div>
      <h4 class="title">My Queue</h4>
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
import { spotify_api } from "../utils/spotify-api";
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

Vue.component("Queue");

export default {
  name: "Queue",
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
      options: [],
      queue: [],
      playlist: [],
      category: null,
      categories: ["artist", "track", "album"]
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
        spotify_api
          .post("/playlists/" + this.currentPlaylist + "/tracks", {
            uris: uris
          })
          .then(res => {
            if (res.status == 201) {
              this.queue = [];
              this.init();
            }
          });
      }
    },
    init() {
      spotify_api
        .get("/playlists/" + this.currentPlaylist + "/tracks")
        .then(res => (this.playlist = res.data.items))
        .catch(error => {
          console.log(error);
        });
    },
    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        spotify_api
          .get("/search?q=" + val + "&type=track")
          .then(res => (this.options = res.data.tracks.items));
      });
    }
  },

  created() {
    this.init();
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
