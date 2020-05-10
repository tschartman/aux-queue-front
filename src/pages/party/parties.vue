<template>
  <div>
    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="parties" label="All Parties"></q-tab>
      <q-tab name="party" label="Current Party"></q-tab>
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="parties">
        <followingParties @joinParty="joinParty" :parties="parties" />
      </q-tab-panel>
      <q-tab-panel name="party">
        <party
          v-if="currentParty || joinedParty"
          @refreshParty="refreshParty"
          @leaveParty="leaveParty"
        />
        <div v-else>
          <div class="row justify-center">
            <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
          </div>
          <div class="row justify-center text-body1">
            You are currently not in any parties. Join one from one of your
            friends or start your own!
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  JOIN_PARTY_MUTATION,
  CREATE_PARTY_MUTATION,
  PARTY_CREATED_SUBSCRIPTION,
  PARTY_DELETED_SUBSCRIPTION
} from "src/graphql/queries/partyQueries";
import { QTabs, QTab, QTabPanel, QTabPanels, QSeparator } from "quasar";
import followingParties from "components/following/followingParties";
import party from "src/pages/party/party";
const alerts = [
  {
    color: "negative",
    message: "Error occured creating party",
    icon: "report_problem"
  },
  {
    color: "negative",
    message: "Error occured joining party",
    icon: "report_problem"
  }
];
export default {
  name: "Parties",
  components: {
    followingParties,
    party,
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QSeparator
  },
  data() {
    return {
      parties: [],
      tab: "parties",
      joinedParty: false
    };
  },
  apollo: {
    parties: {
      query: GET_PARTIES_QUERY,
      subscribeToMore: [
        {
          document: PARTY_CREATED_SUBSCRIPTION,
          updateQuery: function(previousResult, { subscriptionData }) {
            let newParty = subscriptionData.data.partyCreated;
            if (!this.parties.find(p => p.id === newParty.id)) {
              return Array.from(this.parties.push(newParty));
            }
          }
        },
        {
          document: PARTY_DELETED_SUBSCRIPTION,
          updateQuery: function(previousResult, { subscriptionData }) {
            let deletedParty = subscriptionData.data.partyDeleted;
            this.parties = Array.from(
              this.parties.filter(p => p.id !== deletedParty.id)
            );
          }
        }
      ]
    }
  },
  computed: {
    currentParty: function() {
      return (
        this.parties.find(
          p => p.host.userName === this.$store.getters.user.userName
        ) ||
        this.parties.find(
          p =>
            p.guests.findIndex(
              user => user.userName == this.$store.getters.user.userName
            ) !== -1
        )
      );
    }
  },
  methods: {
    async joinParty(userName) {
      const joinParty = await this.$apollo.mutate({
        mutation: JOIN_PARTY_MUTATION,
        variables: { userName: userName }
      });
      if (joinParty.data.joinParty.ok) {
        this.joinedParty = true;
        this.tab = "party";
      } else {
        this.$q.notify(alerts[1]);
      }
    },
    async startParty() {
      const createParty = await this.$apollo.mutate({
        mutation: CREATE_PARTY_MUTATION
      });
      if (createParty.data.createParty.ok) {
        this.tab = "party";
      } else {
        this.$q.notify(alerts[0]);
      }
    },
    refreshParty(id, currentlyPlaying) {
      let parties = Array.from(this.parties);
      let partyIndex = parties.findIndex(p => p.id === id);
      if (partyIndex !== -1) {
        parties[partyIndex].currentlyPlaying = currentlyPlaying;
        this.parties = parties;
      }
    },
    leaveParty() {
      this.joinedParty = false;
      this.tab = "parties";
    }
  }
};
</script>
<style scoped>
.title {
  display: block;
  margin: auto;
  text-align: center;
}
</style>
