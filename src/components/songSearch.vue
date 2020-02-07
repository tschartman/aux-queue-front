<template>
  <div>
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
          v-on:click="$emit('selectSong', scope.opt)"
          clickable
          v-close-popup
        >
          <q-item-section avatar>
            <q-img :src="scope.opt.album.images[0].url" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.name" />
            <q-item-label caption>{{ scope.opt.artists[0].name }}</q-item-label>
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
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import { QSelect, QItem, QImg } from "quasar";

export default {
  name: "songSearch",
  props: {
    method: { type: Function }
  },
  components: {
    QSelect,
    QItem,
    QImg
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
    }
  }
};
</script>
