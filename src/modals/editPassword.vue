<template>
  <div class="row justify-center items-center">
    <q-card class="screen" flat>
      <q-card-section>
        <form>
          <h5>Change Password</h5>
          <q-input
            @keyup.enter="submit"
            v-model="oldPassword"
            :error-message="oldPasswordErrors[0]"
            :error="oldPasswordErrors.length > 0"
            type="password"
            label="Old Password"
            required
            @blur="$v.oldPassword.$touch()"
          ></q-input>
          <div class="sep"></div>
          <q-input
            @keyup.enter="submit"
            v-model="password"
            :error-message="passwordErrors[0]"
            :error="passwordErrors.length > 0"
            type="password"
            label="Password"
            required
            @blur="$v.password.$touch()"
          ></q-input>
          <q-input
            @keyup.enter="submit"
            v-model="repeatPassword"
            :error-message="repeatPasswordErrors[0]"
            :error="repeatPasswordErrors.length > 0"
            type="password"
            label="Confirm Password"
            required
            @blur="$v.repeatPassword.$touch()"
          ></q-input>
        </form>
        <p class="authError" v-if="authError">{{ authError }}</p>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat @click="cancel" color="dark">cancel</q-btn>
        <q-btn flat class="mr-4" @click="submit" color="primary">submit</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength } from "vuelidate/lib/validators";
import { UPDATE_PASSWORD_MUTATION } from "src/graphql/queries/userQueries";

import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QCardSection
  //  QSpinnerRadio
} from "quasar";
export default {
  mixins: [validationMixin],
  validations: {
    oldPassword: {
      required
    },
    password: {
      required,
      minLength: minLength(8)
    },
    repeatPassword: {
      sameAsPassword: sameAs("password")
    }
  },
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput
    //    QSpinnerRadio
  },
  data() {
    return {
      oldPassword: "",
      password: "",
      repeatPassword: "",
      checkbox: false,
      loading: false,
      authError: ""
    };
  },
  computed: {
    oldPasswordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength && errors.push("Must be valid Password");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    repeatPasswordErrors() {
      const errors = [];
      if (!this.$v.repeatPassword.$dirty) return errors;
      !this.$v.repeatPassword.sameAsPassword &&
        errors.push("Passwords must match");
      !this.$v.password.required &&
        errors.push("Confirmed password is required");
      return errors;
    }
  },
  methods: {
    async submit() {
      this.loading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        let data = {
          oldPass: this.oldPassword,
          newPass: this.password
        };
        const changedPassword = await this.$apollo.mutate({
          mutation: UPDATE_PASSWORD_MUTATION,
          variables: data
        });
        if (changedPassword.data.updatePassword.ok) {
          this.$emit("success");
        } else {
          this.authError = changedPassword.data.updatePassword.error;
        }
      }
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
<style scoped>
h5 {
  margin: 0;
}
.loading {
  font-size: 25px;
}

.logo {
  margin: auto;
  display: block;
}

.authError {
  color: red;
}

.screen {
  padding: 1em;
  flex: 1;
  max-width: 700px;
}

.sep {
  margin: 1em;
}
</style>
