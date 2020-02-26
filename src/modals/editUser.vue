<template>
  <div class="justify-center items-center">
    <q-card class="screen">
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
        </form>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat @click="$emit('cancel')" color="dark">cancel</q-btn>
        <q-btn flat class="mr-4" @click="submit" color="primary">submit</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { UPDATE_USER_MUTATION } from "src/graphql/queries/userQueries";

import { QBtn, QCard, QCardActions, QInput, QCardSection } from "quasar";
export default {
  props: {
    user: Object,
    method: { type: Function }
  },
  mixins: [validationMixin],
  validations: {
    firstName: { required },
    lastName: { required },
    email: { required, email }
  },
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardSection,
    QInput
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: ""
    };
  },
  computed: {
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
    }
  },
  methods: {
    async submit() {
      if (!this.$v.$invalid) {
        let data = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email
        };
        const updateUser = await this.$apollo.mutate({
          mutation: UPDATE_USER_MUTATION,
          variables: data
        });

        if (updateUser.data.updateUser.ok) {
          this.$emit("success", updateUser.data.updateUser.user);
        }
      }
    }
  },
  created() {
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.email = this.user.email;
  }
};
</script>
<style scoped>
h5 {
  margin: 0.5rem;
}
.screen {
  min-width: 300px;
}
</style>
