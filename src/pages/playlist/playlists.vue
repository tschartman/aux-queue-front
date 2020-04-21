<template>
  <div>
    <div>
      <h4 class="title">My Playlists</h4>
      <div class="row">
        <div class="col-xs-12 q-pa-md">
          <searchContainer @selectSong="addToQueue" />
        </div>
      </div>
      <div class="row justify-center items-center">
        <q-btn flat color="black" label="Submit" @click="addSongs" />
      </div>
      <hr />
      <q-item-label header>Queue</q-item-label>
      <songList
        :action="true"
        :songs="queue"
        @deleteAction="remove"
        @postAction="addSong"
      />
      <hr />
      <q-item-label header>
        <playlistSelect
          :playlists="playlists"
          :playlist="playlist"
          @update="updatePlaylist"
        />
      </q-item-label>
      <songList :action="false" :songs="songs" />
    </div>
  </div>
</template>
<script>
import { spotify_api } from "src/utils/spotify-api";
import searchContainer from "components/songs/searchContainer";
import songList from "components/songs/songList";
import playlistSelect from "components/playlist/playlistSelect";
import { QItemLabel } from "quasar";

export default {
  name: "playlists",
  components: {
    QItemLabel,
    searchContainer,
    songList,
    playlistSelect
  },
  data() {
    return {
      audio: null,
      model: null,
      options: [],
      queue: [],
      songs: [],
      playlist: null,
      playlists: []
    };
  },

  computed: {},
  methods: {
    addToQueue(newSong) {
      if (this.queue.some(song => song.id === newSong.id)) {
        return;
      } else {
        this.queue.push(newSong);
      }
    },
    remove(song) {
      let index = this.queue.indexOf(song);
      this.queue.splice(index, 1);
    },
    updatePlaylist(plist) {
      this.playlist = plist;
      this.init();
    },
    playPreview(url) {
      if (this.audio) {
        let current = this.audio;
        this.audio.pause();
        this.audio = null;
        if (current.src !== url) {
          this.playPreview(url);
        }
      } else {
        this.audio = new Audio(url);
        this.audio.play();
      }
    },
    addSongs() {
      let uris = [];
      this.queue.map(track => {
        uris.push(track.uri);
        this.songs.push(track);
      });

      if (this.queue.length > 0) {
        spotify_api
          .post("/playlists/" + this.playlist.id + "/tracks", {
            uris: uris
          })
          .then(res => {
            if (res.status === 201) {
              this.queue = [];
              this.init();
            }
          });
      }
    },
    addSong(song) {
      spotify_api
        .post("/playlists/" + this.playlist.id + "/tracks", {
          uris: [song.uri]
        })
        .then(res => {
          if (res.status === 201) {
            this.remove(song);
            this.init();
          }
        });
    },
    init() {
      spotify_api
        .get("/playlists/" + this.playlist.id + "/tracks")
        .then(
          res =>
            (this.songs = res.data.items.map(item => {
              return item.track;
            }))
        )
        .catch(error => {
          console.log(error);
        });
    },
    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        spotify_api
          .get("/search?q=" + val + "&type=track")
          .then(res => (this.options = res.data.tracks.items));
      });
    }
  },

  created() {
    spotify_api
      .get("/users/" + this.$store.getters.sUser.id + "/playlists")
      .then(res => {
        this.playlists = res.data.items;
        this.playlist = res.data.items[0];
        this.init();
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
</style>
