<template>
  <div>
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Requested"
      :caption="String(requested.length)"
      default-opened
    >
      <q-item v-for="user in requested" :key="user.userName" clickable>
        <q-item-section @click="$emit('selectUser', user)" avatar>
          <q-avatar>
            <q-img
              :src="user.userImage || 'https://www.gravatar.com/avatar/'"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section @click="$emit('selectUser', user)">
          <q-item-label v-html="user.userName" />
          <q-item-label caption>{{ user.firstName }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <div class="row">
            <div class="q-mx-md">
              <q-icon
                size="md"
                name="clear"
                @click="$emit('updateFollow', 'declined', user.userName)"
              >
                <q-tooltip>
                  Decline
                </q-tooltip>
              </q-icon>
            </div>
            <div class="q-mx-md">
              <q-icon
                size="md"
                name="done"
                @click="$emit('updateFollow', 'accepted', user.userName)"
              >
                <q-tooltip>
                  Accept
                </q-tooltip>
              </q-icon>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item
      v-for="user in accepted"
      :key="user.userName"
      @click="$emit('selectUser', user)"
      clickable
    >
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="user.userImage || 'https://www.gravatar.com/avatar/'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="user.userName" />
        <q-item-label caption
          >{{ user.firstName }} {{ user.lastName }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar, QTooltip, QExpansionItem } from "quasar";

export default {
  components: {
    QImg,
    QAvatar,
    QTooltip,
    QExpansionItem
  },
  props: {
    followers: Array,
    method: { type: Function }
  },
  data() {
    return {
      requested: [],
      accepted: []
    };
  },
  watch: {
    followers: function(updatedFollowers) {
      this.categorizeFollowers(updatedFollowers);
    }
  },
  methods: {
    categorizeFollowers(followers) {
      let accepted = [];
      let requested = [];
      followers.forEach(user => {
        if (user.status === "pending") {
          requested.push(user);
        } else if (user.status === "accepted") {
          accepted.push(user);
        }
      });
      this.accepted = accepted;
      this.requested = requested;
    }
  },
  created() {
    this.categorizeFollowers(this.followers);
  }
};
</script>
