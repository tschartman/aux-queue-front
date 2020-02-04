<template>
  <div>
    <div>
      <h4 class="title">My Queue</h4>
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
            <q-img
              :src="song.album.images[0].url"
              v-on:click="playPreview(song.preview_url)"
            >
              <q-btn
                v-if="audio && audio.src === song.preview_url"
                round
                color="transparent"
                icon="pause"
              />
              <q-btn v-else round color="transparent" icon="play_arrow" />
            </q-img>
          </q-item-section>
          <q-item-section>{{ song.name }}</q-item-section>
          <q-item-section avatar>
            <q-icon @click="remove(song)" name="delete" />
          </q-item-section>
        </q-item>
      </q-intersection>
      <hr />
      <h6 class="title">Now Playing</h6>
      <div class="row justify-center items-center q-pt-lg">
        <q-img
          :src="currentlyPlaying.album.images[0].url"
          style="width: 150px"
          :ratio="1"
          basic
          spinner-color="white"
          class="rounded-borders"
        >
        </q-img>
      </div>

      <div class="row justify-center items-center  q-pa-lg">
        <div class="text-subtitle1">
          {{ currentlyPlaying.name }} - {{ currentlyPlaying.artists[0].name }}
        </div>
      </div>
      <div class="row justify-center items-center">
        <q-btn flat icon="skip_previous" />
        <div class="q-mx-md">
          <q-btn
            v-on:click="playCurrentSong()"
            v-if="paused"
            round
            icon="play_arrow"
          />
          <q-btn v-on:click="pauseCurrentSong()" v-else round icon="pause" />
        </div>
        <q-btn flat icon="skip_next" />
      </div>
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
  QItemSection,
  QItemLabel,
  QIntersection
} from "quasar";

Vue.component("Queue");

export default {
  name: "Queue",
  components: {
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
      currentlyPlaying: null,
      options: [],
      paused: false,
      queue: [],
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
    playSong() {},
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
    },
    pauseCurrentSong() {
      spotify_api.put("/me/player/pause").then(res => {
        if (res.status === 204) {
          this.paused = true;
        }
      });
    },

    playCurrentSong() {
      spotify_api.put("/me/player/play").then(res => {
        if (res.status === 204) {
          this.paused = false;
        }
      });
    }
  },

  created() {
    spotify_api.get("/me/player/currently-playing").then(res => {
      this.currentlyPlaying = res.data.item;
      console.log(this.currentlyPlaying);
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
