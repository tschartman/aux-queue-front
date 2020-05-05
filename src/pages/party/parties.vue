<template>
  <div>
    <div v-if="view === 'parties'">
      <h4 class="title">Parties</h4>
      <div class="row justify-center" q-ma-md>
        <div class="row justify-center" q-ma-md>
          <q-btn @click="startParty" flat color="primary">Start One!</q-btn>
        </div>
        <followingParties @joinParty="joinParty" :parties="parties" />
      </div>
    </div>
    <div v-else class="row justify-center" q-ma-md>
      <party
        @refreshParty="refreshParty"
        @changeView="view = 'parties'"
        :parties="parties"
      />
    </div>
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
    party
  },
  data() {
    return {
      parties: [],
      view: "parties"
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
  methods: {
    async joinParty(userName) {
      const joinParty = await this.$apollo.mutate({
        mutation: JOIN_PARTY_MUTATION,
        variables: { userName: userName }
      });
      if (joinParty.data.joinParty.ok) {
        this.view = "party";
      } else {
        this.$q.notify(alerts[1]);
      }
    },
    async startParty() {
      const createParty = await this.$apollo.mutate({
        mutation: CREATE_PARTY_MUTATION
      });
      if (createParty.data.createParty.ok) {
        this.view = "party";
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
