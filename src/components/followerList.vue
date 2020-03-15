<template>
  <div>
    <q-item v-for="user in followers" :key="user.userName" clickable>
      <q-item-section avatar>
        <q-avatar>
          <q-img :src="user.userImage || 'https://www.gravatar.com/avatar/'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-html="user.userName" />
        <q-item-label caption>{{ user.firstName }}</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <div class="row" v-if="user.status === 'pending'">
          <div class="q-mx-md">
            <q-icon size="lg" name="clear">
              <q-tooltip>
                Decline
              </q-tooltip>
            </q-icon>
          </div>
          <div class="q-mx-md">
            <q-icon size="lg" name="done">
              <q-tooltip>
                Accept
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar, QTooltip } from "quasar";

export default {
  components: {
    QImg,
    QAvatar,
    QTooltip
  },
  props: {
    followers: Array
  }
};
</script>
