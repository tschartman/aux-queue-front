<template>
  <div>
    <div class="row justify-center">
      <q-icon class="q-my-lg" name="lock" style="font-size: 10rem;" />
    </div>
    <div class="row justify-center">
      <q-btn flat color="primary" label="link" v-on:click="redirect()"></q-btn>
    </div>
    <div class="row justify-center">
      <h5>Link Spotify to view content</h5>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    redirect() {
      window.location = "https://auxstack.herokuapp.com/spotify/";
    }
  }
};
</script>
