<template>
  <div>
    <q-select
      rounded
      outlined
      v-model="friends"
      label="Search"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="filterOptions"
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
              :src="user.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.userName" />
            <q-item-label caption>{{ scope.opt.firstName }}</q-item-label>
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
    <div>
      <div class="row" v-if="friend">
        <userView :user="friend" />
        <div class="action q-pt-lg">
          <q-icon
            v-if="friend.status == 'none'"
            size="lg"
            name="person_add"
            v-on:click="sendFollowRequest"
          />
          <q-icon v-if="friend.status == 'pending'" size="lg" name="loop" />
          <q-icon v-if="friend.status == 'accepted'" size="lg" name="done" />
        </div>
      </div>
      <h5 v-else>Place Holder</h5>
      <q-separator />
    </div>
  </div>
</template>
<script>
import { QSelect, QImg, QSeparator } from "quasar";
import { GET_USERS_QUERY } from "src/graphql/queries/userQueries";
import {
  GET_FOLLOWING_QUERY
  //  SEND_FOLLOW_MUTATION
} from "src/graphql/queries/followerQueries";
import userView from "src/components/userView";
const statusList = ["pending", "accepted", "declined", "blocked"];
export default {
  props: {
    user: Object
  },
  components: {
    QSelect,
    QImg,
    QSeparator,
    userView
  },
  data() {
    return {
      friends: [],
      options: [],
      filterOptions: [],
      friend: null
    };
  },
  methods: {
    async selectUser(user) {
      const followingData = await this.$apollo.query({
        query: GET_FOLLOWING_QUERY
      });
      let found = followingData.data.following.find(
        f => f.following.userName === user.userName
      );
      if (found) {
        user.status = statusList[found.status];
      } else {
        user.status = "none";
      }
      this.friend = user;
    },
    sendFollowRequest() {
      // const follow = this.$apollo.mutate({
      //   mutation: SEND_FOLLOW_MUTATION,
      //   variables: {userName: this.friend.userName}
      // })
      console.log(this.friend.userName);
      // if(follow.data..ok){
      //   friend.status === 'pending'
      // }
    },
    filterFn(val, update, abort) {
      if (val.length < 1 || val === "" || !val) {
        abort();
        return;
      }
      update(() => {
        console.log(val);
        const needle = val.toLowerCase();
        this.filterOptions = this.options.filter(
          v => v.userName.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  },
  async created() {
    let users = await this.$apollo.query({ query: GET_USERS_QUERY });
    this.options = users.data.users.filter(user => {
      if (user.userName == this.user.userName) {
        return false;
      }
      return true;
    });
    this.filterOptions = this.options;
  }
};
</script>
