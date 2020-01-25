<template>
  <div>
    <div class="page justify-center items-center">
      <img height="75px" width="300px" :src="imageUrl" />
      <div class="row">
        <div class="col-xs-12 "></div>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "md5";
import {
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QInput,
  QToolbar
} from "quasar";
export default {
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput,
    QToolbar
  },
  data() {
    return {
      user: {},
      imageUrl: ""
    };
  },
  computed: {},
  methods: {},

  created() {
    this.imageURL =
      "https://www.gravatar.com/avatar/" + md5(this.$store.getters.user.email);
    this.user = this.$store.getters.user;
  }
};
</script>
<style></style>
