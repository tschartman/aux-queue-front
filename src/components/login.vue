<template>
  <div class="window-height window-width row justify-center items-center">
    <div class="col-xs-12 col-sm-8 col-md-6 col-lg-4 col-xl-2">
      <q-card class="elevation-12">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>Login</q-toolbar-title>
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
          <q-btn to="/register" color="primary">Sign up</q-btn>
          <q-btn @click="login" color="secondary">Login</q-btn>
        </q-card-actions>
      </q-card>
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
  QCardSection
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
    QToolbar
  },
  data() {
    return {
      username: "",
      password: "",
      authError: ""
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
        this.$store
          .dispatch("login", { username, password })
          .then(() => {
            this.$store
              .dispatch("linkSpotify")
              .then(() => {
                this.$router.push("/");
              })
              .catch(() => {
                this.$router.push("/");
              });
          })
          .catch(error => {
            if (error.response.status == 401) {
              this.authError = "Username or password incorrect";
            }
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
</style>
