<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          AuxQueue
        </q-toolbar-title>
        <a href="https://78caead9.ngrok.io/spotify/">link spotify</a>
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
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>User</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item-label header>Log Out</q-item-label>
        <q-item clickable v-on:click="logout">
          <q-item-section avatar>
            <q-icon name="warning" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  openURL,
  QBtnDropdown,
  QItemLabel,
  QItem,
  QItemSection,
  QImg
} from "quasar";
import { mapMutations } from "vuex";
import { spotify_api } from "../utils/spotify-api";

export default {
  name: "MyLayout",
  components: {
    QBtnDropdown,
    QItemLabel,
    QItem,
    QItemSection,
    QImg
  },
  data() {
    return {
      leftDrawerOpen: false,
      playlists: [],
      model: null
    };
  },

  methods: {
    openURL,
    ...mapMutations(["CHANGE_PLAYLIST"]),
    updatePlaylist(plist) {
      this.model = plist;
      this.CHANGE_PLAYLIST(this.model.id);
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  },
  created() {
    spotify_api.get("/users/tschartman2/playlists").then(res => {
      this.playlists = res.data.items;
      this.model = res.data.items[0];
      this.CHANGE_PLAYLIST(res.data.items[0].id);
    });
  }
};
</script>

<style></style>
