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
      <div v-if="friend">
        <userView :user="friend" />
        <div class="row justify-center" q-ma-md>
          <div v-if="friend.followingStatus === 'none'">
            <q-btn
              flat
              color="primary"
              label="Follow"
              @click="sendFollowRequest"
            />
          </div>
          <div v-if="friend.followingStatus === 'pending'">
            <q-btn flat color="primary" label="Requested">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="unFollow"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Cancel</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
          <div v-if="friend.followingStatus === 'accepted'">
            <q-btn flat color="primary" label="Following">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="unFollow"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Unfollow</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
          <div v-if="friend.followerStatus === 'accepted'">
            <q-btn flat color="primary" label="Follows You">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="block"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Block</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
          <div v-if="friend.followerStatus === 'blocked'">
            <q-btn flat color="primary" label="Blocked">
              <q-menu>
                <q-item
                  style="width: 110px"
                  @click="unBlock"
                  clickable
                  v-close-popup
                >
                  <q-item-section>Unblock</q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
      <h5 v-else>Place Holder</h5>
      <q-separator />
    </div>
  </div>
</template>
<script>
import { QSelect, QImg, QSeparator, QMenu } from "quasar";
import { GET_USERS_QUERY } from "src/graphql/queries/userQueries";
import {
  GET_FOLLOWING_QUERY,
  GET_FOLLOWERS_QUERY,
  SEND_FOLLOW_MUTATION,
  UPDATE_FOLLOWER_MUTATION,
  REMOVE_FOLLOW_MUTATION,
  REMOVE_FOLLOWER_MUTATION
} from "src/graphql/queries/followerQueries";
import userView from "src/components/userView";
const statusList = ["pending", "accepted", "declined", "blocked"];
export default {
  props: {
    user: Object,
    selectedFriend: Object
  },
  components: {
    QSelect,
    QImg,
    QSeparator,
    QMenu,
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
  watch: {
    selectedFriend: {
      immediate: true,
      deep: true,
      async handler(selectedFriend) {
        if (selectedFriend.friend) {
          this.friend = selectedFriend.friend;
          const followerStatus = await this.findFollowerStatus(
            selectedFriend.friend.userName
          );
          this.$set(
            this.friend,
            "followingStatus",
            selectedFriend.friend.status
          );
          this.$set(this.friend, "followerStatus", followerStatus);
        }
      }
    }
  },
  methods: {
    async selectUser(user) {
      this.friend = user;
      const followingStatus = await this.findFollowingStatus(user.userName);
      const followerStatus = await this.findFollowerStatus(user.userName);
      this.$set(this.friend, "followingStatus", followingStatus);
      this.$set(this.friend, "followerStatus", followerStatus);
    },
    async findFollowingStatus(userName) {
      const followingData = await this.$apollo.query({
        query: GET_FOLLOWING_QUERY
      });
      let found = followingData.data.following.find(
        f => f.following.userName === userName
      );
      if (found) {
        return statusList[found.status];
      }
      return "none";
    },
    async findFollowerStatus(userName) {
      const followerData = await this.$apollo.query({
        query: GET_FOLLOWERS_QUERY
      });
      let found = followerData.data.followers.find(
        f => f.follower.userName === userName
      );
      if (found) {
        return statusList[found.status];
      }
      return "none";
    },
    async sendFollowRequest() {
      const follow = await this.$apollo.mutate({
        mutation: SEND_FOLLOW_MUTATION,
        variables: { userName: this.friend.userName }
      });
      if (follow.data.sendFollowRequest.ok) {
        this.$set(this.friend, "followingStatus", "pending");
      }
    },
    async unFollow() {
      const removeFollow = await this.$apollo.mutate({
        mutation: REMOVE_FOLLOW_MUTATION,
        variables: {
          userName: this.friend.userName
        }
      });
      if (removeFollow.data.removeFollowRequest.ok) {
        this.$set(this.friend, "followingStatus", "none");
      }
    },
    async block() {
      const updatedFollower = await this.$apollo.mutate({
        mutation: UPDATE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName,
          status: "blocked"
        }
      });
      if (updatedFollower.data.updateFollowerRequest.ok) {
        this.$set(this.friend, "followerStatus", "blocked");
      }
    },
    async unBlock() {
      const removeFollower = await this.$apollo.mutate({
        mutation: REMOVE_FOLLOWER_MUTATION,
        variables: {
          userName: this.friend.userName
        }
      });
      if (removeFollower.data.removeFollowerRequest.ok) {
        this.$set(this.friend, "followerStatus", "none");
      }
    },
    filterFn(val, update, abort) {
      if (val.length < 1 || val === "" || !val) {
        abort();
        return;
      }
      update(() => {
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
