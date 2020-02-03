<template>
  <div class="page justify-center items-center">
    <img height="75px" width="300px" src="/statics/AuxQueue-logo.png" />
    <div class="col-xs-12">
      <q-card class="screen" flat bordered>
        <q-toolbar class="bg-black text-white">
          <q-toolbar-title>Sign Up</q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <form>
            <h5>User Info</h5>
            <q-input
              @keyup.enter="submit"
              v-model="firstName"
              :error-message="firstNameErrors[0]"
              :error="firstNameErrors.length > 0"
              label="First Name"
              required
              @input="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
            ></q-input>
            <q-input
              @keyup.enter="submit"
              v-model="lastName"
              :error-message="lastNameErrors[0]"
              :error="lastNameErrors.length > 0"
              label="Last Name"
              required
              @input="$v.lastName.$touch()"
              @blur="$v.lastName.$touch()"
            ></q-input>
            <q-input
              @keyup.enter="submit"
              v-model="email"
              :error-message="emailErrors[0]"
              :error="emailErrors.length > 0"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></q-input>
            <div class="sep"></div>
            <h5>Password</h5>
            <q-input
              @keyup.enter="submit"
              v-model="password"
              :error-message="passwordErrors[0]"
              :error="passwordErrors.length > 0"
              type="password"
              label="Password"
              required
              @input="$v.password.$touch()"
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
              @input="$v.repeatPassword.$touch()"
              @blur="$v.repeatPassword.$touch()"
            ></q-input>
            <q-checkbox
              v-model="checkbox"
              :error-message="checkboxErrors[0]"
              :error="checkboxErrors.length > 0"
              label="Do you agree?"
              required
              @change="$v.checkbox.$touch()"
              @blur="$v.checkbox.$touch()"
            ></q-checkbox>
          </form>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn flat @click="cancel" color="dark">cancel</q-btn>
          <q-btn flat class="mr-4" @click="submit" color="primary"
            >submit</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, email } from "vuelidate/lib/validators";
import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QToolbar,
  QCardSection,
  QCheckbox
} from "quasar";
import { app_api } from "../utils/app-api";
export default {
  mixins: [validationMixin],
  validations: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8)
    },
    repeatPassword: {
      sameAsPassword: sameAs("password")
    },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput,
    QToolbar,
    QCheckbox
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      checkbox: false
    };
  },
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push("First Name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Last Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
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
    submit: function() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        let data = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email.toLowerCase(),
          password: this.password
        };
        app_api
          .post("/users/", data)
          .then(res => {
            this.$router.push("/login"), console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    cancel: function() {
      this.$router.push("/login");
    }
  }
};
</script>
<style>
h5 {
  margin: 0;
}

.sep {
  margin: 1em;
}
</style>
