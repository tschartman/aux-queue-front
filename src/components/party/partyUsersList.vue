<template>
  <div v-if="guests">
    <q-item v-for="guest in guests" :key="guest.user.userName">
      <q-item-section avatar>
        <q-avatar>
          <q-img
            :src="guest.user.userImage || 'https://www.gravatar.com/avatar/'"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="guest.user.userName" />
        <q-item-label caption
          >{{ guest.user.firstName }} {{ guest.user.lastName }}</q-item-label
        >
      </q-item-section>
      <q-item-section avatar>
        <div class="text-subtitle2">
          {{ guest.amountRequested }}
          <q-tooltip>Songs Requested</q-tooltip>
        </div>
      </q-item-section>
      <q-item-section avatar>
        <div class="text-subtitle2 clickable">
          {{ guest.allowedRequests }}
          <q-tooltip>Allowed Requests</q-tooltip>
        </div>
        <q-popup-edit
          v-model.number="guest.allowedRequests"
          @save="updateRequests($event, guest.id)"
          buttons
        >
          <q-input
            :min="guest.amountRequested"
            type="number"
            v-model.number="guest.allowedRequests"
            dense
            autofocus
          />
        </q-popup-edit>
      </q-item-section>
      <q-item-section avatar>
        <q-icon
          size="sm"
          name="pan_tool"
          @click="kickUser(guest.user.userName, guest.id)"
          color="red"
        >
          <q-tooltip>
            Kick from party
          </q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar, QTooltip, QPopupEdit, QInput } from "quasar";
import {
  UPDATE_ALLOWED_REQUEST,
  REMOVE_FROM_PARTY_MUTATION
} from "src/graphql/queries/partyQueries";
export default {
  components: {
    QImg,
    QAvatar,
    QTooltip,
    QPopupEdit,
    QInput
  },
  props: {
    users: Array,
    method: { type: Function }
  },
  data() {
    return {
      guests: []
    };
  },
  methods: {
    async updateRequests(value, id) {
      const updatedRequest = await this.$apollo.mutate({
        mutation: UPDATE_ALLOWED_REQUEST,
        variables: { id: id, amount: value }
      });
      if (!updatedRequest.data.updateAllowedRequests.ok) {
        this.$q.notify({
          color: "negative",
          message: "Error updating requests amount",
          icon: "report_problem"
        });
      }
    },
    kickUser(username, id) {
      this.$q.notify({
        message:
          "Are you sure you want to kick " + username + " from your party?",
        actions: [
          { label: "Nevermind", color: "white", handler: () => {} },
          {
            label: "Kick them out!",
            color: "red",
            handler: () => {
              this.sendRemoveRequest(id);
            }
          }
        ]
      });
    },
    async sendRemoveRequest(id) {
      const removeFromParty = await this.$apollo.mutate({
        mutation: REMOVE_FROM_PARTY_MUTATION,
        variables: { id: id }
      });
      if (removeFromParty.data.removeFromParty.ok) {
        this.guests = Array.from(this.guests).filter(g => g.id === id);
      } else {
        this.$q.notify({
          color: "negative",
          message: "Error removing user from party",
          icon: "report_problem"
        });
      }
    }
  },
  created() {
    this.guests = Array.from(this.users);
  }
};
</script>
<style lang="stylus">
.clickable {
  cursor pointer;
}
</style>
