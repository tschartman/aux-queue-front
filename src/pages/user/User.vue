<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="social" icon="public" label="Social" />
          <q-tab name="following" icon="plus_one" label="Following" />
          <q-tab name="profile" icon="person" label="Profile" />
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
          <q-tab-panel name="social">
            <Friends :user="user" :selectedFriend="selectedFriend" />
          </q-tab-panel>
          <q-tab-panel name="following">
            <Following @selectUser="selectUser" />
          </q-tab-panel>
          <q-tab-panel name="profile">
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
            <userView :user="user" />
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
            <spotifyCarousel v-if="$store.getters.isLinked" />
            <notLinked v-else />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import spotifyCarousel from "src/components/user/spotifyCarousel";
import editUser from "src/modals/editUser";
import editUserName from "src/modals/editUserName";
import editPassword from "src/modals/editPassword";
import Friends from "src/pages/user/Friends";
import userView from "src/components/user/userView";
import notLinked from "src/pages/auth/notLinked";
import Following from "src/pages/user/Following";
import {
  QSeparator,
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

import { USER_DATA_QUERY } from "src/graphql/queries/userQueries";
export default {
  components: {
    QSeparator,
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
    editPassword,
    Friends,
    spotifyCarousel,
    userView,
    notLinked,
    Following
  },
  data() {
    return {
      modal: "",
      slide: 1,
      user: {},
      selectedFriend: {},
      updatedFriend: {},
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
    selectUser(user) {
      this.tab = "social";
      this.$set(this.selectedFriend, "friend", user);
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
    }
  },

  async created() {
    const userData = await this.$apollo.query({
      query: USER_DATA_QUERY
    });
    this.user = userData.data.user;
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
