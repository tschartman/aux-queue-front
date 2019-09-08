<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        hint="Basic autocomplete"
        style="width: 250px; padding-bottom: 32px"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
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
  </div>
</template>
<script>
import Vue from "vue";
import { QSelect, QItem, QImg } from 'quasar';

Vue.component('Queue')


export default {
  name: "Queue",
    components: {
    QSelect,
    QItem,  
    QImg
  },
  data () {
    return {
      model: null,
      options: []
    }
  },

  methods: {
    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        this.$axios
            .get('https://api.spotify.com/v1/search?q=' + val + '&type=track')
            .then(res =>{
                console.log(res.data.tracks.items[0].album.images[0].url)
                this.options = res.data.tracks.items})
      })
    }
  }
}
</script>