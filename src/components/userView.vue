<template>
  <div class="row justify-center">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="user.userImage || 'https://secure.gravatar.com/avatar'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <div class="text-h6">{{ user.firstName }} {{ user.lastName }}</div>
        </q-item-label>
        <q-item-label>
          Friend Code:
          <div class="text-subtitle2">
            {{ user.userName }}
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section horizontal>
      <q-card-section> </q-card-section>
      <q-card-section> </q-card-section>
    </q-card-section>
  </div>
</template>
<script>
import { QAvatar, QItem } from "quasar";
export default {
  components: {
    QAvatar,
    QItem
  },
  props: {
    user: Object
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
