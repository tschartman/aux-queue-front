<template>
  <div>
    <q-item v-for="user in following" :key="user.userName" clickable>
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
      <q-item-section avatar>
        <div>
          <q-icon v-if="user.status === 'pending'" size="md" name="loop">
            <q-tooltip>
              Pending
            </q-tooltip>
          </q-icon>
          <q-icon v-if="user.status === 'accepted'" size="md" name="done">
            <q-tooltip>
              Following
            </q-tooltip>
          </q-icon>
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
    following: Array
  }
};
</script>
<style lang="stylus"></style>
