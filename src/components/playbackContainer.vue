<template>
  <currentPlayback
    :currentlyPlaying="currentlyPlaying"
    :paused="paused"
    :progress="progress"
    :duration="duration"
    :interval="interval"
    @playAll="playAll"
    @playNow="playNow"
    @playCurrentSong="playCurrentSong"
    @pauseCurrentSong="pauseCurrentSong"
    @skipNext="skipNext"
    @skipPrevious="skipPrevious"
  />
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import currentPlayback from "components/currentPlayback";

export default {
  name: "playbackContainer",
  props: {
    method: { type: Function }
  },
  components: {
    currentPlayback
  },
  data() {
    return {
      currentlyPlaying: null,
      id: "",
      paused: false,
      progress: 0,
      duration: 0,
      interval: 0
    };
  },
  methods: {
    playAll(queue) {
      let uris = queue.map(song => {
        return song.uri;
      });

      spotify_api
        .put("/me/player/play", { uris: uris })
        .then(res => {
          //  if (res.status == 204) {
          console.log(res);
          this.$emit("removeAll");
          this.resetView();
          this.init();
          //  }
        })
        .catch(error => {
          console.log(error);
        });
    },
    playNow(song) {
      let uris = [song.uri];
      spotify_api
        .put("/me/player/play", { uris: uris })
        .then(res => {
          //  if (res.status == 204) {
          console.log(res);
          this.$emit("remove");
          this.resetView();
          this.init();
          //  }
        })
        .catch(error => {
          console.log(error);
        });
    },
    playCurrentSong() {
      spotify_api.put("/me/player/play").then(res => {
        //  if (res.status === 204) {
        console.log(res);
        this.paused = false;
        //  }
      });
    },
    pauseCurrentSong() {
      spotify_api.put("/me/player/pause").then(res => {
        if (res.status === 204) {
          this.paused = true;
        }
      });
    },
    skipNext() {
      spotify_api.post("/me/player/next").then(res => {
        //  if (res.status == 204) {
        console.log(res);
        this.init();
        //  }
      });
    },
    skipPrevious() {
      spotify_api.post("/me/player/previous").then(res => {
        //  if (res.status == 204) {
        console.log(res);
        this.init();
        // }
      });
    },
    resetView() {
      this.currentlyPlaying = null;
      this.duration = 0;
      this.progress = 0;
    },
    init() {
      clearInterval(this.interval);
      spotify_api.get("/me/player/currently-playing").then(res => {
        console.log(res);
        if (
          res.data !== "" &&
          res.data.is_playing &&
          res.data.item.id != this.id
        ) {
          this.currentlyPlaying = res.data.item;
          this.id = res.data.item.id;
          this.duration = res.data.item.duration_ms;
          this.progress = res.data.progress_ms;
          this.interval = setInterval(() => {
            if (this.progress >= this.duration) {
              this.resetView();
              this.init();
            } else if (!this.paused) {
              this.progress = this.progress + 10;
            }
          }, 10);
        } else if (!res.data.is_playing && res.data.item.id != this.id) {
          console.log("here");
          this.currentlyPlaying = res.data.item;
          this.id = res.data.id;
          this.duration = res.data.item.duration_ms;
          this.progress = res.data.progress_ms;
          this.paused = true;
        } else {
          this.duration = res.data.item.duration_ms;
          this.progress = res.data.progress_ms;
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>
