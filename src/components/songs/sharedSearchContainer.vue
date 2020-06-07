<template>
  <songSearch
    :options="options"
    :model="model"
    @selectSong="selectSong"
    @filterFn="filterFn"
  />
</template>
<script>
import axios from "axios";
import songSearch from "components/songs/songSearch";
export default {
  name: "searchContainer",
  props: {
    config: Object,
    method: { type: Function }
  },
  components: {
    songSearch
  },
  data() {
    return {
      options: [],
      model: null,
      baseUrl: "https://api.spotify.com/v1"
    };
  },
  methods: {
    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        axios
          .get(this.baseUrl + "/search?q=" + val + "&type=track", this.config)
          .then(res => (this.options = res.data.tracks.items));
      });
    },
    selectSong(song) {
      this.$emit("selectSong", song);
    }
  }
};
</script>
