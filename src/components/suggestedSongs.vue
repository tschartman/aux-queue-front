<template>
  <div>
    <q-intersection
      v-for="suggested in sortedSongs"
      :key="suggested.id"
      once
      transition="scale"
    >
      <q-item>
        <q-item-section avatar>
          <q-img
            :src="suggested.song.coverUri"
            v-on:click="playPreview(suggested.song.preview_url)"
          >
            <q-btn
              v-if="audio && audio.src === suggested.song.preview_url"
              round
              color="transparent"
              icon="pause"
            />
            <q-btn v-else round color="transparent" icon="play_arrow" />
          </q-img>
        </q-item-section>
        <q-item-section
          >{{ suggested.song.title }} -
          {{ suggested.song.artist }}</q-item-section
        >
        <q-item-section avatar>
          <q-icon
            :color="
              suggested.rating.find(
                r => r.user.userName === $store.getters.user.userName && r.like
              )
                ? 'blue'
                : ''
            "
            @click="$emit('likeAction', suggested)"
            name="arrow_upward"
          />
        </q-item-section>
        <q-item-section avatar>
          {{ score(suggested) }}
        </q-item-section>
        <q-item-section avatar>
          <q-icon
            :color="
              suggested.rating.find(
                r => r.user.userName === $store.getters.user.userName && !r.like
              )
                ? 'red'
                : ''
            "
            @click="$emit('dislikeAction', suggested)"
            name="arrow_downward"
          />
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
  computed: {
    sortedSongs: function() {
      let suggested = Array.from(this.songs);
      return suggested.sort((a, b) => this.score(b) - this.score(a));
    }
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
    },
    score(song) {
      return (
        song.rating.filter(r => r.like).length -
        song.rating.filter(r => !r.like).length
      );
    }
  },
  created() {}
};
</script>
