<template>
  <div>
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
        </div>
    <hr>
    <q-list>
    <div class="row">
        <div class="col-md-8">
        <q-item-label header>Songs to add</q-item-label>
        </div>
        <div class="col-md-2">
        <q-btn color="primary" label="Add Songs" @click="addSongs" />
        </div>
    </div>
      <q-item 
      v-for="song in queue"
      :key="song.name"
      clickable
      v-ripple>
        <q-item-section avatar>
            <q-img :src="song.album.images[0].url" />
        </q-item-section>
        <q-item-section>{{song.name}}</q-item-section>
        <q-item-section avatar>
            <q-icon @click="remove(song)" name="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <hr>
    <q-list>
    <q-item-label header>Playlist</q-item-label>
      <q-item 
      v-for="song in playlist"
      :key="song.name"
      clickable
      v-ripple>
        <q-item-section avatar>
            <q-img :src="song.track.album.images[0].url" />
        </q-item-section>

        <q-item-section>{{song.track.name}}</q-item-section>
      </q-item>
    </q-list>
    <q-btn @click="skipTrack" color="deep-orange" glossy label="Skip" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { QSelect, QBtn, QItem, QImg, QIcon, QList, QItemSection, QItemLabel } from 'quasar';

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
    QBtn,
    QIcon
  },
  data () {
    return {
      model: null,
      options: [],
      queue: [], 
      playlist: []
    }
  },

  methods: {

    skipTrack(){
        this.$axios
            .post('https://api.spotify.com/v1/me/player/next')
    
    },
    addToQueue(song){
        this.queue.push(song)
    },
    remove(song){
        let index = this.queue.indexOf(song)
        this.queue.splice(index)
    },
    addSongs(){
        let uris = []
        this.queue.map( track => {
            uris.push(track.uri)
        })

        this.$axios
            .post('https://api.spotify.com/v1/playlists/3eS4UAXLQYZ5QCX8kQrIcu/tracks', {"uris": uris})
            .then(res => {
                console.log(res)
                this.queue = [];
                this.init()
            })
    },
    init(){
        this.$axios
            .get('https://api.spotify.com/v1/playlists/3eS4UAXLQYZ5QCX8kQrIcu/tracks')
            .then(res => this.playlist = res.data.items)
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
  },

  mounted() {
      this.init()
  }
}
</script>