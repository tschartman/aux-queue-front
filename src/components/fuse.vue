<template>
  <div>
    <h4 class="title">Fuse Playlists</h4>
    <div class="form">
      <div class="row justify-center items-center">
        <div class="col-xs-5 q-pa-lg">
          <q-input v-model="text" label="Fused Playlist Name" />
        </div>
        <div class="col-xs-7 q-pa-lg">
          <q-btn-dropdown
            v-if="this.$store.getters.isLoggedIn"
            stretch
            flat
            :label="model1 === null ? 'Playlists' : model1.name"
          >
            <q-list>
              <q-item
                v-for="plist in playlists"
                :key="plist.id"
                @click="model1 = plist"
                clickable
                v-close-popup
                tabindex="0"
              >
                <q-item-section avatar>
                  <q-img :src="plist.images[0].url" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ plist.name }}</q-item-label>
                  <q-item-label caption>{{
                    plist.owner.display_name
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            v-if="this.$store.getters.isLoggedIn"
            stretch
            flat
            :label="model2 === null ? 'Playlists' : model2.name"
          >
            <q-list>
              <q-item
                v-for="plist in playlists"
                :key="plist.id"
                @click="model2 = plist"
                clickable
                v-close-popup
                tabindex="0"
              >
                <q-item-section avatar>
                  <q-img :src="plist.images[0].url" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ plist.name }}</q-item-label>
                  <q-item-label caption>{{
                    plist.owner.display_name
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
      <div class="row justify-center items-center">
        <div class="col-xs-6 q-pa-lg">
          <q-checkbox
            v-model="dPlay"
            label="Delete fused playlists"
            color="teal"
          />
        </div>
        <div class="col-xs-3 q-pa-lg">
          <q-btn color="primary" v-on:click="fusePlaylists">Fuse</q-btn>
        </div>
        <div class="col-xs-3 q-pa-lg">
          <q-btn color="secondary">Submit</q-btn>
        </div>
      </div>
    </div>
    <hr />
    <q-list>
      <q-item-label header>Fused Plalist</q-item-label>
      <q-item v-for="song in fused" :key="song.name" clickable v-ripple>
        <q-item-section avatar>
          <q-img :src="song.album.images[0].url" />
        </q-item-section>
        <q-item-section>{{ song.name }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
import Vue from "vue";
import { spotify_api } from "../utils/spotify-api";
import {
  QBtn,
  QItem,
  QImg,
  QList,
  QItemSection,
  QItemLabel,
  QBtnDropdown,
  QInput,
  QCheckbox
} from "quasar";

Vue.component("Queue");

export default {
  name: "Queue",
  components: {
    QItem,
    QImg,
    QList,
    QItemSection,
    QItemLabel,
    QBtn,
    QBtnDropdown,
    QInput,
    QCheckbox
  },
  data() {
    return {
      playlist: null,
      model1: null,
      model2: null,
      text: "",
      dPlay: false,
      fused: []
    };
  },

  computed: {},
  methods: {
    fusePlaylists() {
      spotify_api
        .get("/playlists/" + this.model1.id + "/tracks")
        .then(res1 => {
          spotify_api
            .get("/playlists/" + this.model2.id + "/tracks")
            .then(res2 => {
              this.addUnique(res1.data.items, res2.data.items);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    addUnique(p1, p2) {
      let uniqList = {};
      let max = Math.max(p1.length, p2.length);
      for (let i = 0; i < max; i++) {
        if (p2.length > i && p1.length > i) {
          uniqList[p1[i].track.id] = p1[i].track;
          uniqList[p2[i].track.id] = p2[i].track;
        } else if (p1.length < i) {
          uniqList[p2[i].track.id] = p2[i].track;
        } else if (p2.length < i) {
          uniqList[p1[i].track.id] = p1[i].track;
        }
      }

      this.fused = Object.values(uniqList);
      console.log(this.fused);
    }
  },

  created() {
    spotify_api
      .get("/users/" + this.$store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.model1 = res.data.items[0];
        this.model2 = res.data.items[1];
      });
  }
};
</script>
<style scoped>
.title {
  display: block;
  margin: auto;
  text-align: center;
}

.form {
  display: block;
  margin: auto;
  text-align: center;
}
</style>
