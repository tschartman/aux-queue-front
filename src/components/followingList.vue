<template>
  <div>
    <q-item
      v-for="user in following"
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
      <q-item-section avatar> </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { QImg, QAvatar } from "quasar";

export default {
  components: {
    QImg,
    QAvatar
  },
  props: {
    following: Array,
    method: { type: Function }
  }
};
</script>
<style lang="stylus"></style>
