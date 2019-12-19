<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Register</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <form>
                <h3>User Info</h3>
                <v-text-field
                  @keyup.enter="submit"
                  v-model="firstName"
                  :error-messages="firstNameErrors"
                  label="First Name"
                  required
                  @input="$v.firstName.$touch()"
                  @blur="$v.firstName.$touch()"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  v-model="lastName"
                  :error-messages="lastNameErrors"
                  label="Last Name"
                  required
                  @input="$v.lastName.$touch()"
                  @blur="$v.lastName.$touch()"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  required
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field>
                <h3>Password</h3>
                <v-text-field
                  @keyup.enter="submit"
                  v-model="password"
                  :error-messages="passwordErrors"
                  type="password"
                  label="Password"
                  required
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  v-model="repeatPassword"
                  :error-messages="repeatPasswordErrors"
                  type="password"
                  label="Confirm Password"
                  required
                  @input="$v.repeatPassword.$touch()"
                  @blur="$v.repeatPassword.$touch()"
                ></v-text-field>
                <v-checkbox
                  v-model="checkbox"
                  :error-messages="checkboxErrors"
                  label="Do you agree?"
                  required
                  @change="$v.checkbox.$touch()"
                  @blur="$v.checkbox.$touch()"
                ></v-checkbox>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="cancel" color="error">cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn class="mr-4" @click="submit" color="success">submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, email } from "vuelidate/lib/validators";
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
          username: this.email,
          password: this.password
        };
        this.$http
          .post("http://localhost:8000/users/", data)
          .then(res => {
            this.$router.push("/login");
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