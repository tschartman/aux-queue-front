<template>
  <div class="page">
    <div class="row justify-center">
      <h6>Following Parties</h6>
    </div>
    <q-scroll-area style="height: 400px;">
      <div class="row justify-center">
        <div
          class="q-pa-lg"
          v-for="party in parties"
          :key="party.host.userName"
        >
          <q-card class="party-card" flat bordered>
            <q-img
              v-if="party.currentlyPlaying"
              :src="party.currentlyPlaying.coverUri"
            />
            <q-card-section>
              <div class="text-h6 q-my-xs">{{ party.host.userName }}</div>
              <div class="text-caption text-grey">
                other friends in party
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn
                @click="$emit('joinParty', party.host.userName)"
                flat
                color="primary"
                label="Join Party"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { QScrollArea, QCard, QCardSection, QCardActions, QImg } from "quasar";

export default {
  components: {
    QScrollArea,
    QCard,
    QCardSection,
    QCardActions,
    QImg
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
.page {
  width: 100%;
}
.party-card {
  width: 200px;
  height: 300px;
}
</style>
