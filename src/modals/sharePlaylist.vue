<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h6">Share a Playlist!</div>
          <playlistSelect
            :playlists="playlists"
            :playlist="playlist"
            @update="updatePlaylist"
          />
        </q-card-section>
        <q-card-section class="col-5 flex flex-center">
          <q-img
            :src="playlist.images[0].url"
            style="width: 150px"
            :ratio="1"
            basic
            spinner-color="white"
            class="rounded-borders"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat color="primary" @click="copy" label="Copy To Clipboard" />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import playlistSelect from "components/playlistSelect";
import { QImg, QBtn, QSeparator } from "quasar";
import Store from "src/store/index";
const alerts = [
  {
    color: "secondary",
    message: "Copied to clipboard!",
    icon: "thumb_up"
  }
];
export default {
  components: {
    QImg,
    QBtn,
    QSeparator,
    playlistSelect
  },
  data() {
    return {
      playlists: [],
      playlist: null,
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
          "/sharePlaylist?code=" +
          code +
          "&playlist=" +
          this.id +
          "&name=" +
          this.name
      );
      this.$q.notify(alerts[0]);
    },
    updatePlaylist(plist) {
      this.playlist = plist;
      this.id = plist.id;
    }
  },
  created() {
    spotify_api
      .get("/users/" + Store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.playlist = res.data.items[0];
        this.id = res.data.items[0].id;
        this.name = res.data.items[0].name;
      });
  }
};
</script>
<style scoped>
.share-card {
  width: 100%;
}
</style>
