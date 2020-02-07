<template>
  <div>
    <q-btn-dropdown
      stretch
      flat
      :label="playlist === null ? 'Playlists' : playlist.name"
    >
      <q-list>
        <q-item
          v-for="plist in playlists"
          :key="plist.id"
          @click="$emit('update', plist)"
          clickable
          v-close-popup
          tabindex="0"
        >
          <q-item-section avatar>
            <q-img v-if="plist.images.length > 0" :src="plist.images[0].url" />
            <q-icon class="q-pl-md q-pt-xs" v-else name="camera_alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ plist.name }}</q-item-label>
            <q-item-label caption>{{ plist.owner.display_name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script>
import { QBtnDropdown, QItem, QImg, QIcon, QItemSection } from "quasar";

export default {
  name: "playlistSelect",
  props: {
    playlists: Array,
    playlist: Object,
    method: { type: Function }
  },
  components: {
    QBtnDropdown,
    QItem,
    QImg,
    QIcon,
    QItemSection
  }
};
</script>
