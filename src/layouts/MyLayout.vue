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

      <q-btn-dropdown stretch flat :label="model.name || 'Playlists'">
        <q-list>
          <q-item v-for="plist in playlists" :key="plist.id" @click="updatePlaylist(plist)" clickable v-close-popup tabindex="0">
            <q-item-section avatar>
              <q-img :src="plist.images[0].url" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{plist.name}}</q-item-label>
              <q-item-label caption>{{plist.owner.display_name}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://github.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://chat.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://forum.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://twitter.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://facebook.quasar.dev"
        >
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@QuasarFramework</q-item-label>
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
import { openURL, QBtnDropdown, QItemLabel, QItem, QItemSection, QImg } from "quasar";
import { mapMutations } from "vuex";

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
      this.CHANGE_PLAYLIST(this.model.id)
    },
  },
  mounted() {
     this.$axios
            .get("https://api.spotify.com/v1/users/tschartman2/playlists")
            .then(res => {
              this.playlists = res.data.items
              this.model = res.data.items[0]
              this.CHANGE_PLAYLIST(res.data.items[0].id)
              })
  }
};
</script>

<style></style>
