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
          <q-icon
            v-if="scope.opt.status == 'none'"
            size="md"
            name="person_add"
          />
          <q-icon v-if="scope.opt.status == 'pending'" size="sm" name="loop" />
          <q-icon v-if="scope.opt.status == 'accepted'" size="sm" name="done" />
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
      <userView v-if="friend" :user="friend" />
      <h5 v-else>Place Holder</h5>
      <q-separator />
    </div>
  </div>
</template>
<script>
import { QSelect, QImg, QSeparator } from "quasar";
import { GET_USERS_QUERY } from "src/graphql/queries/userQueries";
import {
  GET_FRIENDS_QUERY,
  GET_FRIEND_QUERY
} from "src/graphql/queries/friendQueries";
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
      this.friend = user;
      if (user.status === "accepted") {
        let data = { userName: user.userName };
        const friendData = await this.$apollo.query({
          query: GET_FRIEND_QUERY,
          variables: data
        });
        if (friendData.data.friend) {
          console.log("good request");
        } else {
          console.log("not friends");
        }
      } else {
        console.log("no friend no query");
      }
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
    const friends = await this.$apollo.query({ query: GET_FRIENDS_QUERY });
    this.options = users.data.users
      .filter(user => {
        if (user.userName == this.user.userName) {
          return false;
        }
        return true;
      })
      .map(user => {
        let foundUser = friends.data.friends.find(
          friend => friend.userTwo.userName === user.userName
        );
        if (foundUser) {
          user["status"] = statusList[foundUser.status];
        } else {
          user["status"] = "none";
        }
        return user;
      });
    this.filterOptions = this.options;
  }
};
</script>
