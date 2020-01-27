<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h6">Share Your Queue!</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-btn-dropdown
          stretch
          flat
          :label="model === null ? 'Playlists' : model.name"
        >
          <q-list>
            <q-item
              v-for="plist in playlists"
              :key="plist.id"
              @click="updatePlaylist(plist)"
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
        <q-btn @click="copy">
          Copy to clipboard
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pt-none justify-center">
        <q-img
          :src="model.images[0].url"
          style="width: 150px"
          :ratio="1"
          basic
          spinner-color="white"
          class="rounded-borders"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { spotify_api } from "../utils/spotify-api";
import {
  QBtnDropdown,
  QItemLabel,
  QItem,
  QItemSection,
  QImg,
  QBtn
} from "quasar";
import Store from "../store/index";
const alerts = [
  {
    color: "secondary",
    message: "Copied to clipboard!",
    icon: "thumb_up"
  }
];
export default {
  components: {
    QBtnDropdown,
    QItemLabel,
    QItem,
    QItemSection,
    QImg,
    QBtn
  },
  data() {
    return {
      playlists: [],
      model: null,
      id: ""
    };
  },
  methods: {
    copy() {
      let code = this.$store.getters.spotifyToken;
      let base = window.webpackHotUpdate
        ? "http://localhost:8080"
        : "https://auxqueue.com";
      this.$clipboard(
        base +
          "/share?code=" +
          code +
          "&playlist=" +
          this.id +
          "&name=" +
          this.name
      );
      this.$q.notify(alerts[0]);
    },
    updatePlaylist(plist) {
      console.log(plist);
      this.model = plist;
      this.id = plist.id;
    }
  },
  created() {
    spotify_api
      .get("/users/" + Store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.model = res.data.items[0];
        this.id = res.data.items[0].id;
        this.name = res.data.items[0].name;
      });
  }
};
</script>
