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
    <div class="row justify-center items-center ">
      <q-card class="screen" flat>
        <div class="row items-center justify-center">
          <div class="q-mx-lg">
            <h4>Sign Up</h4>
          </div>
          <div>
            <q-spinner-radio v-if="loading" color="cyan" class="loading" />
          </div>
        </div>
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
  USER_CREATION_MUTATON,
  TOKEN_AUTH_MUTATION
} from "src/graphql/queries/authQueries";

const alerts = [
  {
    color: "negative",
    message: "User Created Successfully!",
    icon: "thumb_up"
  },
  {
    color: "negative",
    message: "Error occured during creation",
    icon: "report_problem"
  }
];

import {
  QBtn,
  QCard,
  QCardActions,
  QInput,
  QCardSection,
  QCheckbox,
  QSpinnerRadio
} from "quasar";
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
    QCheckbox,
    QSpinnerRadio
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      checkbox: false,
      loading: false
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
    async submit() {
      this.loading = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        let data = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email.toLowerCase(),
          password: this.password
        };

        const createdUser = await this.$apollo.mutate({
          mutation: USER_CREATION_MUTATON,
          variables: data
        });
        if (createdUser.data.createUser.ok) {
          const loggedInUser = await this.$apollo.mutate({
            mutation: TOKEN_AUTH_MUTATION,
            variables: {
              email: data.email,
              password: data.password
            }
          });
          if (loggedInUser.data) {
            await this.$store.dispatch("login", loggedInUser);
            this.$router.push("/user");
          } else {
            this.$router.push("/login");
            this.$q.notify(alerts[0]);
          }
        } else {
          this.loading = false;
          this.$q.notify(alerts[1]);
        }
      }
    },
    cancel() {
      this.$router.push("/login");
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

.screen {
  margin: 3em;
  flex: 1;
  max-width: 700px;
}

.sep {
  margin: 1em;
}
</style>
