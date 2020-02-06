<template>
  <div>
    <div>
      <h4 class="title">My Playlists</h4>
      <div class="row">
        <div class="col-xs-12 q-pa-md">
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
      </div>
      <div class="row justify-center items-center">
        <q-btn flat color="black" label="Submit" @click="addSongs" />
      </div>
      <hr />
      <q-item-label header>Queue</q-item-label>
      <q-intersection
        v-for="song in queue"
        :key="song.name"
        once
        transition="scale"
      >
        <q-item v-if="queue.length > 0" clickable v-ripple>
          <q-item-section avatar>
            <q-img :src="song.album.images[0].url" />
          </q-item-section>
          <q-item-section>{{ song.name }}</q-item-section>
          <q-item-section avatar>
            <q-icon @click="remove(song)" name="delete" />
          </q-item-section>
        </q-item>
      </q-intersection>
      <hr />
      <q-item-label header>
        <q-btn-dropdown
          stretch
          flat
          :label="playlist === null ? 'Playlists' : playlist.name"
        >
          <q-list>
            <q-item
              v-for="plist in playlists"
              :key="plist.id"
              @click="updatePlaylist(plist)"
              clickable
              v-close-popup
              tabindex="0"
            >
              <q-item-section avatar>
                <q-img
                  v-if="plist.images.length > 0"
                  :src="plist.images[0].url"
                />
                <q-icon class="q-pl-md q-pt-xs" v-else name="camera_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ plist.name }}</q-item-label>
                <q-item-label caption>{{
                  plist.owner.display_name
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item-label>

      <q-intersection
        v-for="song in songs"
        :key="song.name"
        once
        transition="scale"
      >
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-img
              :src="song.track.album.images[0].url"
              v-on:click="playPreview(song.track.preview_url)"
            >
              <q-btn
                v-if="audio && audio.src === song.track.preview_url"
                round
                color="transparent"
                icon="pause"
              />
              <q-btn v-else round color="transparent" icon="play_arrow" />
            </q-img>
          </q-item-section>

          <q-item-section>{{ song.track.name }}</q-item-section>
        </q-item>
      </q-intersection>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { spotify_api } from "src/utils/spotify-api";
import {
  QBtnDropdown,
  QSelect,
  QBtn,
  QItem,
  QImg,
  QIcon,
  QItemSection,
  QItemLabel,
  QIntersection
} from "quasar";

Vue.component("Queue");

export default {
  name: "Queue",
  components: {
    QBtnDropdown,
    QSelect,
    QItem,
    QImg,
    QItemSection,
    QItemLabel,
    QBtn,
    QIcon,
    QIntersection
  },
  data() {
    return {
      audio: null,
      model: null,
      options: [],
      queue: [],
      songs: [],
      playlist: null,
      playlists: [],
      category: null,
      categories: ["artist", "track", "album"]
    };
  },

  computed: {},
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
    updatePlaylist(plist) {
      this.playlist = plist;
      this.init();
    },
    playPreview(url) {
      if (this.audio) {
        let current = this.audio;
        this.audio.pause();
        this.audio = null;
        if (current.src !== url) {
          this.playPreview(url);
        }
      } else {
        this.audio = new Audio(url);
        this.audio.play();
      }
    },
    addSongs() {
      let uris = [];
      this.queue.map(track => {
        uris.push(track.uri);
        this.songs.push(track);
      });

      if (this.queue.length > 0) {
        spotify_api
          .post("/playlists/" + this.playlist.id + "/tracks", {
            uris: uris
          })
          .then(res => {
            if (res.status === 201) {
              this.queue = [];
              this.init();
            }
          });
      }
    },
    init() {
      spotify_api
        .get("/playlists/" + this.playlist.id + "/tracks")
        .then(res => (this.songs = res.data.items))
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
    spotify_api
      .get("/users/" + this.$store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.playlist = res.data.items[0];
        this.init();
      });
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
