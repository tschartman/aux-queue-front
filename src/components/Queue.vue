<template>
  <div>
    <div>
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        style="width: 250px; padding-bottom: 32px"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
            v-on:click="addToQueue(scope.opt)"
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

    <q-list bordered>
      <q-item 
      v-for="song in queue"
      :key="song.name"
      clickable
      v-ripple>
        <q-item-section avatar>
            <q-img :src="song.album.images[0].url" />
        </q-item-section>

        <q-item-section>{{song.name}}</q-item-section>
      </q-item>
    </q-list>
    <q-btn @click="skipTrack" color="deep-orange" glossy label="Skip" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { QSelect, QBtn, QItem, QImg, QList, QItemSection, QItemLabel } from 'quasar';

Vue.component('Queue')


export default {
  name: "Queue",
    components: {
    QSelect,
    QItem,  
    QImg,
    QList,
    QItemSection,
    QItemLabel,
    QBtn
  },
  data () {
    return {
      model: null,
      options: [],
      queue: []
    }
  },

  methods: {

    skipTrack(){
        this.$axios
            .post('https://api.spotify.com/v1/me/player/next')
            .then(res => console.log(res))
    },
    addToQueue(song){
        this.queue.push(song)
    },

    filterFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
        update(() => {
            this.$axios
                .get('https://api.spotify.com/v1/search?q=' + val + '&type=track')
                .then(res =>this.options = res.data.tracks.items)
        })
    }
  }
}
</script>