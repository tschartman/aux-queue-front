<template>
  <div>
    <q-intersection
      v-for="song in songs"
      :key="song.title"
      once
      transition="scale"
    >
      <q-item v-if="songs && songs.length > 0">
        <q-item-section avatar>
          <q-img
            :src="song.coverUri"
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
        <q-item-section>{{ song.title }} - {{ song.artist }}</q-item-section>
        <q-item-section avatar>
          <q-icon @click="$emit('dislikeAction', song)" name="arrow_upward" />
        </q-item-section>
        <q-item-section avatar>
          {{
            song.rating.filter(r => r.like).length -
              song.rating.filter(r => !r.like).length
          }}
        </q-item-section>
        <q-item-section avatar>
          <q-icon @click="$emit('likeAction', song)" name="arrow_downward" />
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>
<script>
import { QIntersection, QItem, QImg, QItemSection, QBtn, QIcon } from "quasar";

export default {
  name: "suggestedSongs",
  props: {
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
  },
  created() {}
};
</script>
