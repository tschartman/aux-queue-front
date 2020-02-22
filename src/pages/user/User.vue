<template>
  <div>
    <div class="row justify-center">
      <q-select
        rounded
        outlined
        v-model="friends"
        label="Search Friends"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
      >
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
            v-on:click="selectUser(scope.opt)"
            clickable
            v-close-popup
          >
            <q-item-section avatar>
              <q-img
                :src="
                  'https://www.gravatar.com/avatar/' + hash(scope.opt.email)
                "
              />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.userName" />
              <q-item-label caption>{{ scope.opt.userName }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <br />
    <div class="row justify-center q-pa-md">
      <q-card class="my-card" flat bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="imageUrl" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label
              >{{ user.firstName }} {{ user.lastName }}</q-item-label
            >
            <q-item-label caption>
              {{ user.userName }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section horizontal>
          <q-card-section> </q-card-section>
          <q-card-section class="col-4">
            This is where a bio could go
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <q-separator />
    <div class="row justify-center">
      <div class="q-mx-lg">
        <h5>Top Spotify {{ category }}</h5>
      </div>
      <div>
        <q-btn
          v-if="category === 'Artists'"
          round
          @click="category = 'Tracks'"
          style="height: 50px"
          icon="art_track"
        />
        <q-btn
          v-else
          round
          @click="category = 'Artists'"
          style="height: 50px"
          icon="face"
        />
      </div>
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
import gql from "graphql-tag";
import md5 from "md5";
import { spotify_api } from "src/utils/spotify-api";
import {
  QAvatar,
  QCard,
  QSelect,
  QItem,
  QImg,
  QSeparator,
  QCarousel,
  QCarouselSlide
} from "quasar";
import { USER_DATA_QUERY } from "src/graphql/queries/userQueries";
export default {
  components: {
    QAvatar,
    QCard,
    QSelect,
    QItem,
    QImg,
    QSeparator,
    QCarousel,
    QCarouselSlide
  },
  data() {
    return {
      slide: 1,
      user: {},
      category: "Artists",
      artistMatrix: [],
      friends: [],
      imageUrl: "",
      friend: null,
      options: []
    };
  },
  computed: {},
  methods: {
    hash(string) {
      return md5(string);
    },

    splitArray(array) {
      let templist = [];
      let i,
        j,
        chunk = 4;
      for (i = 0, j = array.length; i < j; i += chunk) {
        templist.push({ row: array.slice(i, i + chunk) });
      }
      return templist;
    },
    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        this.$apollo
          .query({
            query: gql`
              query getUsers {
                users {
                  email
                }
              }
            `
          })
          .then(result => {
            this.options = result.data.users;
          });
      });
    },

    selectUser(user) {
      console.log(user);
    }
  },

  async created() {
    const userData = await this.$apollo.query({
      query: USER_DATA_QUERY
    });

    const artists = await spotify_api.get("/me/top/artists");
    const tracks = await spotify_api.get("/me/top/tracks");
    this.artistMatrix = this.splitArray(artists.data.items);
    this.trackMatrix = this.splitArray(tracks.data.items);
    this.user = userData.data.user;
    this.imageUrl = "https://www.gravatar.com/avatar/" + md5(this.user.email);
  }
};
</script>
<style>
.my-card {
  width: 100%;
  max-width: 350px;
}
</style>
