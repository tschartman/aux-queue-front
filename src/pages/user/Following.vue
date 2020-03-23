<template>
  <div>
    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="following" label="Following">{{ following.length }} </q-tab>
      <q-tab name="followers" label="Followers">{{ followers.length }}</q-tab>
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="following">
        <followingList :following="following" @selectUser="selectUser" />
      </q-tab-panel>
      <q-tab-panel name="followers">
        <followerList
          :followers="followers"
          @selectUser="selectUser"
          @updateFollow="updateFollow"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  GET_FOLLOWERS_QUERY,
  GET_FOLLOWING_QUERY,
  UPDATE_FOLLOWER_MUTATION,
  REMOVE_FOLLOWER_MUTATION
} from "src/graphql/queries/followerQueries";
import { QTabs, QTab, QTabPanel, QTabPanels, QSeparator } from "quasar";
import followerList from "src/components/followerList";
import followingList from "src/components/followingList";
const statusList = ["pending", "accepted", "declined", "blocked"];
export default {
  props: {
    method: { type: Function }
  },
  components: {
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QSeparator,
    followerList,
    followingList
  },
  data() {
    return {
      tab: "following",
      following: [],
      followers: []
    };
  },
  methods: {
    selectUser(user) {
      this.$emit("selectUser", user);
    },
    async updateFollow(status, userName) {
      let updatedFollowers = this.followers.slice(0);
      const followerIndex = updatedFollowers.findIndex(user => {
        return user.userName === userName;
      });
      if (status === "declined") {
        const removeFollower = await this.$apollo.mutate({
          mutation: REMOVE_FOLLOWER_MUTATION,
          variables: {
            userName: userName
          }
        });
        if (removeFollower.data.removeFollowerRequest.ok) {
          updatedFollowers.splice(followerIndex, 1);
          this.followers = updatedFollowers;
        }
      } else {
        const updatedFollower = await this.$apollo.mutate({
          mutation: UPDATE_FOLLOWER_MUTATION,
          variables: {
            userName: userName,
            status: status
          }
        });
        if (updatedFollower.data.updateFollowerRequest.ok) {
          updatedFollowers[followerIndex].status = status;
          this.followers = updatedFollowers;
        }
      }
    }
  },

  async created() {
    const following = await this.$apollo.query({
      query: GET_FOLLOWING_QUERY
    });
    const followers = await this.$apollo.query({
      query: GET_FOLLOWERS_QUERY
    });
    this.following = following.data.following
      .filter(user => {
        return user.status === 1;
      })
      .map(user => {
        let tempUser = user.following;
        tempUser["status"] = statusList[user.status];
        return tempUser;
      });

    this.followers = followers.data.followers
      .filter(user => {
        return user.status !== 3;
      })
      .map(user => {
        let tempUser = user.follower;
        tempUser["status"] = statusList[user.status];
        return tempUser;
      });
  }
};
</script>
<style></style>
