<template>
  <div>
    <h4 class="title">Parties</h4>
    <div class="q-pa-md">
      <searchContainer />
    </div>
    <div class="row justify-center" q-ma-md>
      <q-btn flat color="primary">Start One!</q-btn>
    </div>
    <hr />
  </div>
</template>
<script>
import {
  GET_PARTIES_QUERY,
  GET_PARTY_QUERY
} from "src/graphql/queries/partyQueries";
import searchContainer from "components/searchContainer";
export default {
  name: "Queue",
  components: {
    searchContainer
  },
  data() {
    return {
      parties: [],
      party: {}
    };
  },
  computed: {},
  methods: {},
  async created() {
    const party = await this.$apollo.query({
      query: GET_PARTY_QUERY
    });
    const parties = await this.$apollo.query({
      query: GET_PARTIES_QUERY
    });
    this.parties = parties.data.parties;
    this.party = party.data.party;
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
