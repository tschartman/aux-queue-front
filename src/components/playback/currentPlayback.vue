<template>
  <div v-if="currentlyPlaying" class="playing">
    <h6 class="title">Now Playing</h6>
    <div class="row justify-center items-center q-pt-lg">
      <q-img
        :src="currentlyPlaying.coverUri"
        style="width: 150px"
        :ratio="1"
        basic
        spinner-color="white"
        class="rounded-borders"
      >
      </q-img>
    </div>

    <div class="row justify-center items-center  q-pt-lg">
      <div class="text-subtitle1">
        {{ currentlyPlaying.title }} - {{ currentlyPlaying.artist }}
      </div>
    </div>
    <div class="row justify-center items-center">
      <q-linear-progress
        class="progress q-ma-lg"
        :value="progress / duration"
        color="black"
      />
    </div>
    <div class="row justify-center text-center">
      <div class="col-xs-6 q-mb-md">
        {{ moment(progress).format("mm:ss") }}
      </div>
      <div class="col-xs-6 q-mb-md">
        {{ moment(duration - progress).format("mm:ss") }}
      </div>
    </div>
    <div v-if="controller" class="row justify-center items-center">
      <q-btn v-on:click="$emit('skipPrevious')" flat icon="skip_previous" />
      <div class="q-mx-md">
        <q-btn
          v-on:click="$emit('playCurrentSong')"
          v-if="paused"
          round
          icon="play_arrow"
        />
        <q-btn
          v-on:click="$emit('pauseCurrentSong')"
          v-else
          round
          icon="pause"
        />
      </div>
      <q-btn v-on:click="$emit('skipNext')" flat icon="skip_next" />
    </div>
  </div>
  <div v-else>
    <h6 class="title">No Songs Playing</h6>
  </div>
</template>
<script>
import { QImg, QLinearProgress } from "quasar";
export default {
  name: "currentPlayback",
  props: {
    currentlyPlaying: Object,
    controller: Boolean,
    paused: Boolean,
    progress: Number,
    duration: Number,
    interval: Number,
    method: { type: Function }
  },
  components: {
    QImg,
    QLinearProgress
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
