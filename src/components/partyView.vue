<template>
  <div>
    <div class="row justify-center">
      <h6>{{ party.host.userName }}'s party</h6>
    </div>
    <suggestedSongs :songs="party.queue" />
  </div>
</template>
<script>
//import { QAvatar, QItem } from "quasar";
import suggestedSongs from "src/components/suggestedSongs";
export default {
  components: {
    suggestedSongs
  },
  props: {
    party: Object
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
