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

        <q-toolbar-title class="icon" v-on:click="$router.push('/')">
          AuxQueue
        </q-toolbar-title>
        <q-btn
          v-if="!$store.getters.isLinked && $store.getters.isLoggedIn"
          v-on:click="redirect()"
          >link spotify</q-btn
        >
        <q-btn-dropdown
          v-if="this.$store.getters.isLoggedIn"
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
        <div v-if="$store.getters.isLoggedIn">
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar>
                <q-img :src="imageURL" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>User Profile</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-on:click="$router.push('/fuse')">
            <q-item-section avatar>
              <q-icon name="compare_arrows" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Fuse Playlists</q-item-label>
            </q-item-section>
          </q-item>
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
        </div>
        <div v-else>
          <q-item clickable to="/register">
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create Acccount</q-item-label>
            </q-item-section>
          </q-item>
        </div>
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
  QAvatar,
  QImg
} from "quasar";
import { mapMutations } from "vuex";
import { spotify_api } from "../utils/spotify-api";
import shareQueue from "../modals/shareQueue";
import Store from "../store/index";
import md5 from "md5";
export default {
  name: "AppBar",
  components: {
    QBtnDropdown,
    QItemLabel,
    QItem,
    QItemSection,
    QImg,
    QAvatar,
    shareQueue
  },
  data() {
    return {
      leftDrawerOpen: false,
      playlists: [],
      model: null,
      share: false,
      imageURL: ""
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
    },
    redirect() {
      window.location = "https://auxstack.herokuapp.com/spotify/";
    }
  },
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.imageURL =
        "https://www.gravatar.com/avatar/" +
        md5(this.$store.getters.user.email);
      spotify_api
        .get("/users/" + Store.getters.sUser.id + "/playlists")
        .then(res => {
          this.playlists = res.data.items;
          this.model = res.data.items[0];
          this.CHANGE_PLAYLIST(res.data.items[0].id);
        });
    }
  }
};
</script>

<style>
.icon {
  cursor: pointer;
}
</style>
