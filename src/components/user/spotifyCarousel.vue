<template>
  <div>
    <div class="row justify-center">
      <div class="q-mx-lg">
        <h5>Top Spotify {{ category }}</h5>
      </div>
    </div>
    <div class="row justify-center">
      <q-btn
        flat
        v-if="category === 'Artists'"
        @click="category = 'Tracks'"
        label="See Tracks"
      />
      <q-btn v-else flat @click="category = 'Artists'" label="See Artists" />
    </div>
    <div class="row justify-center">
      <q-carousel
        v-if="category === 'Artists'"
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        style="width:500px"
        height="475px"
        class="rounded-borders"
      >
        <q-carousel-slide
          v-for="(matrix, index) in artistMatrix"
          :name="index"
          v-bind:key="index"
        >
          <div class="row">
            <q-img
              class="col-6"
              ratio="1"
              v-for="artist in matrix.row"
              :src="artist.images[0].url"
              v-bind:key="artist.id"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
      <q-carousel
        v-else
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-color="primary"
        navigation
        padding
        arrows
        style="width:500px"
        height="475px"
        class="rounded-borders"
      >
        <q-carousel-slide
          v-for="(matrix, index) in trackMatrix"
          :name="index"
          v-bind:key="index"
        >
          <div class="row">
            <q-img
              class="col-6"
              ratio="1"
              v-for="track in matrix.row"
              :src="track.album.images[0].url"
              v-bind:key="track.id"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import { QCarousel, QCarouselSlide, QImg } from "quasar";

export default {
  components: {
    QCarousel,
    QCarouselSlide,
    QImg
  },
  data() {
    return {
      modal: "",
      slide: 1,
      user: {},
      category: "Artists",
      artistMatrix: [],
      friends: [],
      imageUrl: "",
      friend: null,
      options: [],
      tab: "social",
      splitterModel: 20,
      edit: false
    };
  },
  computed: {},
  methods: {
    splitArray(array) {
      let templist = [];
      let i,
        j,
        chunk = 4;
      for (i = 0, j = array.length; i < j; i += chunk) {
        templist.push({ row: array.slice(i, i + chunk) });
      }
      return templist;
    }
  },

  async created() {
    const artists = await spotify_api.get("/me/top/artists");
    const tracks = await spotify_api.get("/me/top/tracks");
    this.artistMatrix = this.splitArray(artists.data.items);
    this.trackMatrix = this.splitArray(tracks.data.items);
  }
};
</script>
