<template>
  <div>
    <div class="page justify-center items-center">
      <img height="75px" width="300px" src="/statics/AuxQueue-logo.png" />
      <div class="row">
        <div class="col-xs-12 ">
          <q-card class="screen" flat bordered>
            <q-toolbar class="bg-black text-white">
              <q-toolbar-title>Login</q-toolbar-title>
              <q-spinner-radio v-if="loading" color="cyan" class="loading" />
            </q-toolbar>
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
    </div>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QToolbar,
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
    QToolbar,
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
    login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        let username = this.username.toLowerCase();
        let password = this.password;
        this.loading = true;
        this.$store
          .dispatch("login", { username, password })
          .then(() => {
            this.$store
              .dispatch("linkSpotify")
              .then(() => {
                this.$router.push("/");
                this.loading = false;
              })
              .catch(() => {
                this.$router.push("/");
                this.loading = false;
              });
          })
          .catch(() => {
            this.loading = false;
            this.authError = "Username or password incorrect";
          });
      }
    }
  }
};
</script>
<style>
.authError {
  color: red;
}
.screen {
  margin-top: 3em;
}
.page {
  margin-top: 1em;
  display: grid;
}
.loading {
  font-size: 20px;
}
</style>