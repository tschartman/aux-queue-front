<template>
  <div>
    <q-intersection
      v-for="song in songs"
      :key="song.songUri"
      once
      transition="scale"
    >
      <q-item v-if="songs && songs.length > 0">
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
        <q-item-section v-if="action" avatar>
          <q-icon @click="$emit('postAction', song)" name="arrow_upward" />
        </q-item-section>
        <q-item-section v-if="action" avatar>
          <q-icon @click="$emit('deleteAction', song)" name="delete" />
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>
<script>
import { QIntersection, QItem, QImg, QItemSection, QBtn, QIcon } from "quasar";

export default {
  name: "songList",
  props: {
    action: Boolean,
    songs: Array,
    method: { type: Function }
  },
  components: {
    QItem,
    QImg,
    QItemSection,
    QBtn,
    QIcon,
    QIntersection
  },

  data() {
    return {
      audio: null
    };
  },

  methods: {
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
    }
  }
};
</script>
