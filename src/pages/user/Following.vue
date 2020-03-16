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
  GET_FOLLOWING_QUERY
  //UPDATE_FOLLOW_MUTATION
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
    updateFollow(status) {
      console.log(status);
    }
  },

  async created() {
    const following = await this.$apollo.query({
      query: GET_FOLLOWING_QUERY
    });
    const followers = await this.$apollo.query({
      query: GET_FOLLOWERS_QUERY
    });
    this.following = following.data.following.map(user => {
      let tempUser = user.following;
      tempUser["status"] = statusList[user.status];
      return tempUser;
    });
    this.followers = followers.data.followers.map(user => {
      let tempUser = user.follower;
      tempUser["status"] = statusList[user.status];
      return tempUser;
    });
  }
};
</script>
<style></style>
