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
import axios from "axios";
import currentPlayback from "components/playback/currentPlayback";

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
      paused: false,
      progress: 0,
      duration: 0,
      interval: 0,
      baseUrl: "https://api.spotify.com/v1"
    };
  },
  methods: {
    playAll(queue) {
      let uris = queue.map(song => {
        return song.uri;
      });

      axios
        .put(this.baseUrl + "/me/player/play", { uris: uris }, this.config)
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
      axios
        .put(this.baseUrl + "/me/player/play", { uris: uris }, this.config)
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
      axios.put(this.baseUrl + "/me/player/play", {}, this.config).then(res => {
        //  if (res.status === 204) {
        console.log(res);
        this.paused = false;
        //  }
      });
    },
    pauseCurrentSong() {
      axios
        .put(this.baseUrl + "/me/player/pause", {}, this.config)
        .then(res => {
          if (res.status === 204) {
            this.paused = true;
          }
        });
    },
    skipNext() {
      axios
        .post(this.baseUrl + "/me/player/next", {}, this.config)
        .then(res => {
          //  if (res.status == 204) {
          console.log(res);
          this.init();
          //  }
        });
    },
    skipPrevious() {
      axios
        .post(this.baseUrl + "/me/player/previous", {}, this.config)
        .then(res => {
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
    mapCurrentlyPlaying(data) {
      return {
        name: data.name,
        artist: data.artists[0].name,
        coverUri: data.album.images[0].url
      };
    },
    init() {
      clearInterval(this.interval);
      axios
        .get(this.baseUrl + "/me/player/currently-playing", this.config)
        .then(res => {
          console.log(res);
          if (res.data !== "" && res.data.is_playing) {
            this.currentlyPlaying = this.mapCurrentlyPlaying(res.data.item);
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
          } else if (!res.data.is_playing) {
            console.log("here");
            this.currentlyPlaying = res.data.item;
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
    if (this.$route.query.code) {
      this.config = {
        headers: {
          Authorization: "Bearer " + this.$route.query.code
        }
      };
      axios.get(this.baseUrl + "/me", this.config).then(res => {
        this.$emit("setParent", res.data.display_name, this.config);
        this.init();
      });
    } else {
      this.$router.push("/login");
    }
  }
};
</script>
