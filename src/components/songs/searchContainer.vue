<template>
  <songSearch
    :options="options"
    :model="model"
    @selectSong="selectSong"
    @filterFn="filterFn"
  />
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import songSearch from "components/songs/songSearch";
export default {
  name: "searchContainer",
  props: {
    method: { type: Function }
  },
  components: {
    songSearch
  },
  data() {
    return {
      options: [],
      model: null
    };
  },
  methods: {
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
    selectSong(song) {
      this.$emit("selectSong", song);
    }
  }
};
</script>
