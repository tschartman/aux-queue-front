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
        <q-item-section v-if="!host" avatar>
          <q-icon
            :color="liked(suggested) ? 'blue' : ''"
            @click="$emit('likeAction', suggested)"
            name="arrow_upward"
          >
            <q-tooltip>like</q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section avatar>
          <div class="text-subtitle2">
            {{ score(suggested) }}
            <q-tooltip>rating</q-tooltip>
          </div>
        </q-item-section>
        <q-item-section v-if="host" avatar>
          <q-icon name="delete" color="red">
            <q-tooltip>Remove</q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section v-if="host" avatar>
          <q-icon name="playlist_add" color="blue">
            <q-tooltip>Add To Plalist</q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section v-if="!host" avatar>
          <q-icon
            :color="disliked(suggested) ? 'red' : ''"
            @click="$emit('dislikeAction', suggested)"
            name="arrow_downward"
          >
            <q-tooltip>dislike</q-tooltip>
          </q-icon>
        </q-item-section>
      </q-item>
    </q-intersection>
  </div>
</template>
<script>
import {
  QIntersection,
  QItem,
  QImg,
  QItemSection,
  QBtn,
  QIcon,
  QTooltip
} from "quasar";

export default {
  name: "suggestedSongs",
  props: {
    host: Boolean,
    songs: Array,
    method: { type: Function }
  },
  components: {
    QItem,
    QImg,
    QItemSection,
    QBtn,
    QIcon,
    QIntersection,
    QTooltip
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
    },
    liked(suggested) {
      return suggested.rating.find(
        r => r.user.userName === this.$store.getters.user.userName && r.like
      );
    },
    disliked(suggested) {
      return suggested.rating.find(
        r => r.user.userName === this.$store.getters.user.userName && !r.like
      );
    }
  },
  created() {}
};
</script>
