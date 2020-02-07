<template>
  <div class="row justify-center">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="imageUrl" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label
            >{{ user.first_name }} {{ user.last_name }}</q-item-label
          >
          <q-item-label caption>
            {{ user.email }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section>
          {{ lorem }}
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-4">
          This is where a bio could go
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import md5 from "md5";
import { QAvatar, QCard } from "quasar";
export default {
  components: {
    QAvatar,
    QCard
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
    this.imageUrl =
      "https://www.gravatar.com/avatar/" + md5(this.$store.getters.user.email);
    this.user = this.$store.getters.user;
  }
};
</script>
<style>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>
