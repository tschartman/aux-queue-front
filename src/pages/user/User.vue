<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="profile" icon="person" label="Profile" />
          <q-tab name="friends" icon="people" label="Friends" />
        </q-tabs>
      </template>
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="profile">
            <div class="row justify-center q-pa-md">
              <q-card class="my-card" flat bordered>
                <q-btn class="icon" color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item
                        clickable
                        v-on:click="(modal = 'info'), (edit = true)"
                      >
                        <q-item-section>Edit Info</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-on:click="(modal = 'userName'), (edit = true)"
                      >
                        <q-item-section>Cange Friend Code</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-on:click="
                          edit = true;
                          modal = 'password';
                        "
                      >
                        <q-item-section>Cange Password</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="imageUrl" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <div class="text-h6">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
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
              </q-card>
            </div>
            <q-dialog v-model="edit">
              <editUser
                v-if="modal == 'info'"
                :user="user"
                @cancel="edit = false"
                @success="userUpdated"
              />
              <editUserName
                v-if="modal == 'userName'"
                @cancel="edit = false"
                @success="userNameUpdated"
              />
              <editPassword
                v-if="modal == 'password'"
                @cancel="edit = false"
                @success="passwordUpdated"
              />
            </q-dialog>
            <q-separator />
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
              <q-btn
                v-else
                flat
                @click="category = 'Artists'"
                label="See Artists"
              />
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
          </q-tab-panel>
          <q-tab-panel name="friends">
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
                        'https://www.gravatar.com/avatar/' +
                          hash(scope.opt.email)
                      "
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label v-html="scope.opt.userName" />
                    <q-item-label caption>{{
                      scope.opt.firstName
                    }}</q-item-label>
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
            <div>
              <h5>My Friends</h5>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import md5 from "md5";
import { spotify_api } from "src/utils/spotify-api";
import editUser from "src/modals/editUser";
import editUserName from "src/modals/editUserName";
import editPassword from "src/modals/editPassword";
import {
  QAvatar,
  QCard,
  QSelect,
  QItem,
  QImg,
  QSeparator,
  QCarousel,
  QCarouselSlide,
  QTabs,
  QTab,
  QTabPanel,
  QTabPanels,
  QSplitter,
  QBtn,
  QMenu,
  QDialog
} from "quasar";

const alerts = {
  username: {
    color: "positive",
    message: "Username Updated Sucuessfully!",
    icon: "thumb_up"
  },
  password: {
    color: "positive",
    message: "Password Updated Sucuessfully!",
    icon: "thumb_up"
  },
  user: {
    color: "positive",
    message: "User Updated Sucuessfully!",
    icon: "thumb_up"
  }
};

import {
  USER_DATA_QUERY,
  GET_USERS_QUERY
} from "src/graphql/queries/userQueries";
export default {
  components: {
    QAvatar,
    QCard,
    QSelect,
    QItem,
    QImg,
    QSeparator,
    QCarousel,
    QCarouselSlide,
    QTabs,
    QTab,
    QTabPanel,
    QTabPanels,
    QSplitter,
    QBtn,
    QMenu,
    QDialog,
    editUser,
    editUserName,
    editPassword
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
      tab: "profile",
      splitterModel: 20,
      edit: false
    };
  },
  computed: {},
  methods: {
    hash(string) {
      return md5(string);
    },
    userUpdated(user) {
      this.edit = false;
      this.user = user;
      this.$q.notify(alerts["user"]);
    },
    userNameUpdated(userName) {
      this.edit = false;
      this.user.userName = userName;
      this.$q.notify(alerts["username"]);
    },
    passwordUpdated() {
      this.edit = false;
      this.$q.notify(alerts["password"]);
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
            query: GET_USERS_QUERY
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
.icon {
  float: right;
}
</style>
