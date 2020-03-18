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
        <followingList :following="following" />
      </q-tab-panel>
      <q-tab-panel name="followers">
        <followerList :followers="followers" @updateFollow="updateFollow" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  GET_FOLLOWERS_QUERY,
  GET_FOLLOWING_QUERY,
  UPDATE_FOLLOW_MUTATION
} from "src/graphql/queries/followerQueries";
import { QTabs, QTab, QTabPanel, QTabPanels, QSeparator } from "quasar";
import followerList from "src/components/followerList";
import followingList from "src/components/followingList";
const statusList = ["pending", "accepted", "declined", "blocked"];
export default {
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
  computed: {},
  methods: {
    async updateFollow(status, userName) {
      const updatedFollow = await this.$apollo.mutate({
        mutation: UPDATE_FOLLOW_MUTATION,
        variables: {
          userName: userName,
          status: status
        }
      });
      if (updatedFollow.data.updateFollowRequest.ok) {
        let updatedFollowers = this.followers.slice(0);
        const followerIndex = updatedFollowers.findIndex(user => {
          return user.userName === userName;
        });
        if (status === "declined") {
          updatedFollowers.splice(followerIndex, 1);
        } else {
          updatedFollowers[followerIndex].status = status;
        }
        this.followers = updatedFollowers;
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
        return user.status !== 2;
      })
      .map(user => {
        let tempUser = user.following;
        tempUser["status"] = statusList[user.status];
        return tempUser;
      });

    this.followers = followers.data.followers
      .filter(user => {
        return user.status !== 2;
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
