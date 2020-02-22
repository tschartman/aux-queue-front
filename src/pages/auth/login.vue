<template>
  <div class="justify-center items-center">
    <div class="row">
      <img
        class="logo"
        height="75px"
        width="300px"
        src="/statics/AuxQueue-logo.png"
      />
    </div>
    <div class="row justify-center items-center">
      <q-card class="screen" flat>
        <div class="row items-center justify-center">
          <div class="q-mx-lg">
            <h4>Log In</h4>
          </div>
          <div>
            <q-spinner-radio v-if="loading" color="cyan" class="loading" />
          </div>
        </div>
        <q-card-section>
          <form>
            <q-input
              @keyup.enter="login"
              v-model="username"
              :error-message="usernameErrors[0]"
              :error="usernameErrors.length > 0"
              label="Email"
              name="login"
              prepend-icon="person"
              type="text"
              required
              @input="$v.username.$touch()"
              @blur="$v.username.$touch()"
            ></q-input>

            <q-input
              @keyup.enter="login"
              v-model="password"
              :error-message="passwordErrors[0]"
              :error="passwordErrors.length > 0"
              id="password"
              label="Password"
              name="password"
              prepend-icon="lock"
              type="password"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></q-input>
          </form>
          <p class="authError" v-if="authError">{{ authError }}</p>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat to="/register" color="dark">Sign up</q-btn>
          <q-btn flat @click="login" color="primary">Login</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import {
  TOKEN_AUTH_MUTATION,
  SPOTIFY_AUTH_QUERY
} from "src/graphql/queries/authQueries";
import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QCardSection,
  QSpinnerRadio
} from "quasar";
export default {
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required }
  },
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput,
    QSpinnerRadio
  },
  data() {
    return {
      username: "",
      password: "",
      authError: "",
      loading: false
    };
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    }
  },
  methods: {
    async login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        let username = this.username.toLowerCase();
        let password = this.password;
        this.loading = true;
        await this.$store.commit("auth_request");
        try {
          const loggedInUser = await this.$apollo.mutate({
            mutation: TOKEN_AUTH_MUTATION,
            variables: {
              email: username,
              password: password
            }
          });
          if (loggedInUser.data) {
            await this.$store.dispatch("login", loggedInUser);
            const userSpotify = await this.$apollo.query({
              query: SPOTIFY_AUTH_QUERY
            });
            if (userSpotify.data) {
              let data = {
                access_token: userSpotify.data.user.accessToken,
                refresh_token: userSpotify.data.user.refreshToken
              };
              await this.$store.dispatch("linkSpotify", data);
            }

            this.$router.push("/");
          }
        } catch (err) {
          console.log(err);
          this.loading = false;
          this.authError = "Username or password incorrect";
        }
      }
    }
  }
};
</script>
<style scoped>
.authError {
  color: red;
}
.logo {
  margin: auto;
  display: block;
  position: relative;
}
.screen {
  margin: 3em;
  flex: 1;
  max-width: 400px;
}
.loading {
  font-size: 25px;
}
</style>
