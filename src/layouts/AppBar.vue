<template>
  <div class="test">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-white">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" color="black" />
          </q-btn>

          <q-toolbar-title>
            <img height="35px" width="140px" src="/statics/AuxQueue-logo.png" />
          </q-toolbar-title>
          <q-btn
            v-if="!$store.getters.isLinked && $store.getters.isLoggedIn"
            v-on:click="redirect()"
            >link spotify</q-btn
          >
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
            <q-item
              :active="link === 'home'"
              clickable
              v-on:click="$router.push('/'), (link = 'home')"
            >
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>AuxQueue</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item
              :content-inset-level="1"
              expand-separator
              icon="view_list"
              label="Playlists"
            >
              <q-item
                :active="link === 'playlists'"
                clickable
                v-on:click="$router.push('/playlists'), (link = 'playlists')"
              >
                <q-item-section avatar>
                  <q-icon name="featured_play_list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>My Playlists</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :active="link === 'fuse'"
                clickable
                v-on:click="$router.push('/fuse'), (link = 'fuse')"
              >
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
                  <q-item-label>Share Playlist</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item
              :active="link === 'user'"
              clickable
              v-on:click="$router.push('/user'), (link = 'user')"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>User Profile</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
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
          <sharePlaylist />
        </q-dialog>
      </div>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import {
  openURL,
  QItemLabel,
  QItem,
  QItemSection,
  QIcon,
  QSeparator,
  QExpansionItem
} from "quasar";
import sharePlaylist from "src/modals/sharePlaylist";
export default {
  name: "AppBar",
  components: {
    QItemLabel,
    QItem,
    QItemSection,
    QIcon,
    QSeparator,
    QExpansionItem,
    sharePlaylist
  },
  data() {
    return {
      link: "home",
      leftDrawerOpen: false,
      playlists: [],
      model: null,
      share: false
    };
  },

  methods: {
    openURL,
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    redirect() {
      window.location = "https://auxstack.herokuapp.com/spotify/";
    }
  },
  created() {}
};
</script>

<style scoped>
.router-link {
  display: block;
  color: white;
}
</style>
