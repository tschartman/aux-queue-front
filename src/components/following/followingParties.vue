<template>
  <div class="page">
    <div class="row justify-center">
      <h6>Following Parties</h6>
    </div>
    <q-scroll-area style="height: 550px;">
      <div class="row justify-center">
        <div
          class="q-pa-lg"
          v-for="party in parties"
          :key="party.host.userName"
        >
          <q-card clickable class="party-card" bordered>
            <q-img
              class="cover"
              v-if="party.currentlyPlaying"
              :src="party.currentlyPlaying.coverUri"
            >
              <div class="absolute-bottom">
                <div class="text-subtitle2">
                  {{ party.host.userName }}'s party
                  <q-btn
                    @click="$emit('joinParty', party.host.userName)"
                    flat
                    color="primary"
                    >Join</q-btn
                  >
                </div>
              </div>
            </q-img>
            <div v-else>
              <q-card-section class="row justify-center">
                <div class="text-h6">
                  {{ party.host.userName }}
                </div>
              </q-card-section>
              <q-card-section class="row justify-center"> </q-card-section>
              <q-card-actions class="row justify-center">
                <q-btn
                  flat
                  @click="$emit('joinParty', party.host.userName)"
                  color="primary"
                  >Join</q-btn
                >
              </q-card-actions>
            </div>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea, QCard, QImg, QCardActions, QCardSection } from "quasar";

export default {
  components: {
    QScrollArea,
    QCard,
    QImg,
    QCardActions,
    QCardSection
  },
  props: {
    parties: { type: Array },
    method: { type: Function }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
h6 {
  margin: 0;
}
.page {
  width: 100%;
  overflow: hidden;
}
.party-card {
  width: 200px;
  height: 200px;
}
</style>
