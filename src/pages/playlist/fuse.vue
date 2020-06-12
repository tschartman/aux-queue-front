<template>
  <div>
    <h4 class="title">Fuse Playlists</h4>
    <div class="form">
      <div class="row justify-center items-center">
        <div class="col-xs-12 q-px-lg">
          <q-input
            v-model="text"
            :error-message="playlistsNameErrors[0]"
            :error="playlistsNameErrors.length > 0"
            @input="$v.text.$touch()"
            @blur="$v.text.$touch()"
            label="Fused Playlist Name"
          />
        </div>
      </div>
      <div class="row justify-start">
        <div class="col-xs-6">
          <q-checkbox
            class="q-ml-sm float-left"
            v-model="priv"
            label="Private"
            color="teal"
          />
          <q-checkbox
            class="q-ml-sm float-left"
            v-model="colab"
            label="Collaborative"
            color="teal"
          />
        </div>
      </div>
      <div class="row justify-center items-center">
        <div class="col-xs-12">
          <q-btn flat class="q-ma-lg" color="primary" v-on:click="fusePlaylists"
            >Fuse</q-btn
          >
        </div>
      </div>
      <div class="row justify-center items-center q-py-lg">
        <div class="col-xs-6">
          <playlistSelect
            :playlists="playlists"
            :playlist="playlist1"
            @update="updatePlaylist1"
          />
        </div>
        <div class="col-xs-6">
          <playlistSelect
            :playlists="playlists"
            :playlist="playlist2"
            @update="updatePlaylist2"
          />
        </div>
      </div>
      <div class="row justify-center items-center q-pb-lg">
        <div class="col-xs-6">
          <q-img
            :src="playlist1.images[0].url"
            style="width: 150px"
            :ratio="1"
            basic
            spinner-color="white"
            class="rounded-borders"
          />
        </div>
        <div class="col-xs-6">
          <q-img
            :src="playlist2.images[0].url"
            style="width: 150px"
            :ratio="1"
            basic
            spinner-color="white"
            class="rounded-borders"
          />
        </div>
      </div>
      <div class="row justify-center items-center q-pt-lg">
        <div class="col-xs-6">
          <q-btn flat color="red" v-on:click="clearForm">Cancel</q-btn>
        </div>
        <div class="col-xs-6">
          <q-btn flat color="secondary" v-on:click="createPlaylist"
            >Submit</q-btn
          >
        </div>
      </div>
    </div>
    <hr />
    <q-item-label header>Fused Plalist</q-item-label>
    <songList :action="false" :songs="fused" />
  </div>
</template>
<script>
import Vue from "vue";
import { spotify_api } from "src/utils/spotify-api";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import songList from "components/songs/songList";
import playlistSelect from "components/playlist/playlistSelect";
import { QBtn, QItemLabel, QInput, QCheckbox, QImg } from "quasar";

Vue.component("Queue");
const alerts = [
  {
    color: "negative",
    message: "Warning: You must fuse playlists before submitting!",
    icon: "report_problem"
  },
  {
    color: "secondary",
    message: "Fused Playlist Created! Check your Spotify to listen now",
    icon: "thumb_up"
  }
];
export default {
  mixins: [validationMixin],
  validations: {
    text: { required }
  },
  name: "Queue",
  components: {
    QItemLabel,
    QBtn,
    QInput,
    QCheckbox,
    QImg,
    songList,
    playlistSelect
  },
  data() {
    return {
      playlists: [],
      playlist1: null,
      playlist2: null,
      text: "",
      priv: false,
      colab: false,
      fused: []
    };
  },

  computed: {
    playlistsNameErrors() {
      const errors = [];
      if (!this.$v.text.$dirty) return errors;
      !this.$v.text.required && errors.push("Playlist Name is required.");
      return errors;
    }
  },
  methods: {
    updatePlaylist1(playlist) {
      this.playlist1 = playlist;
    },
    updatePlaylist2(playlist) {
      this.playlist2 = playlist;
    },
    fusePlaylists() {
      spotify_api
        .get("/playlists/" + this.playlist1.id + "/tracks")
        .then(res1 => {
          spotify_api
            .get("/playlists/" + this.playlist2.id + "/tracks")
            .then(res2 => {
              this.addUnique(res1.data.items, res2.data.items);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    addUnique(p1, p2) {
      let uniqList = {};
      let max = Math.max(p1.length, p2.length);
      for (let i = 0; i < max; i++) {
        if (p2.length > i && p1.length > i) {
          uniqList[p1[i].track.name] = p1[i].track;
          uniqList[p2[i].track.name] = p2[i].track;
        } else if (p1.length < i) {
          uniqList[p2[i].track.name] = p2[i].track;
        } else if (p2.length < i) {
          uniqList[p1[i].track.name] = p1[i].track;
        }
      }
      this.fused = Object.values(uniqList);
    },
    clearForm() {
      this.fused = [];
      this.priv = false;
      this.colab = false;
      this.$nextTick(() => {
        this.$v.$reset();
      });
      this.text = "";
    },
    createPlaylist() {
      this.$v.$touch();
      if (!this.$v.$invalid && this.fused.length > 0) {
        let uris = [];
        this.fused.forEach(track => {
          uris.push(track.uri);
        });

        spotify_api
          .post("/users/" + this.$store.getters.sUser.id + "/playlists", {
            name: this.text,
            public: !this.priv,
            collaborative: this.colab
          })
          .then(res => {
            if (res.status === 201) {
              let id = res.data.id;
              spotify_api
                .post("/playlists/" + id + "/tracks", { uris: uris })
                .then(res => {
                  if (res.status === 201) {
                    this.$q.notify(alerts[1]);
                    this.clearForm();
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (this.fused.length <= 0) {
        this.$q.notify(alerts[0]);
      }
    }
  },
  created() {
    spotify_api
      .get("/users/" + this.$store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.playlist1 = res.data.items[0];
        this.playlist2 = res.data.items[1];
      });
  }
};
</script>
<style scoped>
.title {
  display: block;
  margin: auto;
  text-align: center;
}

.form {
  display: block;
  margin: auto;
  text-align: center;
}

.drop {
  max-width: 175px;
}
</style>
