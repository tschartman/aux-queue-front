<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black text-white">
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
        <a
          v-if="!this.$store.getters.isLinked"
          href="https://auxstack.herokuapp.com/spotify/"
          >link spotify</a
        >
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
        <q-item-label header>Options</q-item-label>
        <q-item clickable v-on:click="share = true">
          <q-item-section avatar>
            <q-icon name="share" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Share Queue</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-on:click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Log Out</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="share">
        <shareQueue />
      </q-dialog>
    </div>
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
import shareQueue from "../modals/shareQueue";
export default {
  name: "MyLayout",
  components: {
    QBtnDropdown,
    QItemLabel,
    QItem,
    QItemSection,
    QImg,
    shareQueue
  },
  data() {
    return {
      leftDrawerOpen: false,
      playlists: [],
      model: null,
      share: false
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
    spotify_api.get("/me").then(re => {
      spotify_api.get("/users/" + re.data.id + "/playlists").then(res => {
        this.playlists = res.data.items;
        this.model = res.data.items[0];
        this.CHANGE_PLAYLIST(res.data.items[0].id);
      });
    });
  }
};
</script>

<style></style>
