<template>
  <div>
    <div class="row justify-center">
      <q-select
        rounded
        outlined
        v-model="friends"
        label="Search Friends"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
            v-on:click="selectUser(scope.opt)"
            clickable
            v-close-popup
          >
            <q-item-section avatar>
              <q-img
                :src="
                  'https://www.gravatar.com/avatar/' + hash(scope.opt.email)
                "
              />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.emaik" />
              <q-item-label caption>{{ scope.opt.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <br />
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
          <q-card-section> </q-card-section>

          <q-separator vertical />

          <q-card-section class="col-4">
            This is where a bio could go
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import md5 from "md5";
import { QAvatar, QCard, QSelect, QItem, QImg } from "quasar";
export default {
  components: {
    QAvatar,
    QCard,
    QSelect,
    QItem,
    QImg
  },
  data() {
    return {
      user: {},
      imageUrl: "",
      friend: null,
      options: []
    };
  },
  computed: {},
  methods: {
    hash(string) {
      return md5(string);
    },

    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        this.$apollo
          .query({
            query: gql`
              query getUsers {
                users {
                  email
                }
              }
            `
          })
          .then(result => {
            this.options = result.data.users;
          });
      });
    },

    selectUser(user) {
      console.log(user);
    }
  },

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
