<template>
  <Queue :key="$store.state.playlistId" />
</template>

<style></style>

<script>
import Queue from "../components/Queue.vue";
export default {
  name: "PageIndex",
  components: {
    Queue: Queue
  }
};
</script>
