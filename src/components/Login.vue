<template>
    <div id="login">
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p>Loading...</p>
        </div>
      </transition>
      <div class="col2" :class="{ 'signup-form': !showLoginForm }">
          <form @submit.prevent="login" v-if="showLoginForm">
              <h1>Welcome Back to Vuegram</h1>
              <p v-if="errMsg !== ''" class="error">{{errMsg}}</p>

              <label for="email1">Email</label>
              <input v-model.trim="loginForm.email" type="email" id="email1" required/>

              <label for="password1">Password</label>
              <input v-model.trim="loginForm.password" type="password" id="password1" required/>

              <button class="button" type="submit">Log In</button>

              <div class="extras">
                  <a @click="togglePasswordReset">Forgot Password</a>
                  <a @click="toggleForm">Create an Account</a>
              </div>
          </form>

          <form  v-if="!showLoginForm && !showForgotPassword" @submit.prevent="signup">
              <h1>Get Started</h1>
              <p v-if="errMsg" class="error">{{errMsg}}</p>

              <label for="name">Name</label>
              <input v-model.trim="signupForm.name" type="text" id="name" required />

              <label for="title">Title</label>
              <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" required />

              <label for="email2">Email</label>
              <input v-model.trim="signupForm.email" type="email" id="email2" required />

              <label for="password2">Password</label>
              <input v-model.trim="signupForm.password" type="password" id="password2" required/>

              <button class="button" type="submit">Sign Up</button>

              <div class="extras">
                  <a @click="toggleForm">Back to Log In</a>
              </div>
          </form>

          <form v-if="showForgotPassword" @submit.prevent="resetPassword" class="password-reset">
              <div v-if="!passwordResetSuccess">
                  <h1>Reset Password</h1>
                  <p>We will send you an email to reset your password</p>
                  <p v-if="errMsg" class="error">{{errMsg}}</p>

                  <label for="email3">Email</label>
                  <input v-model.trim="passwordForm.email" type="email" id="email3" required/>

                  <button type="submit" class="button">Submit</button>

                  <div class="extras">
                      <a @click="togglePasswordReset">Back to Log In</a>
                  </div>
              </div>
              <div v-else>
                  <h1>Email Sent</h1>
                  <p>check your email for a link to reset your password</p>
                  <a @click="togglePasswordReset">Back to Log In</a>
              </div>
          </form>
      </div>

    </div>
</template>

<script>
import { auth, usersCollection } from "@/firebase/init.js"
import { mapState } from "vuex"
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: ""
      },
      passwordForm: {
        email: ''
      },
      showLoginForm: true,
      showForgotPassword: false,
    }
  },
  computed: {
    ...mapState([
      "performingRequest",
      "passwordResetSuccess",
      "errMsg"
    ])
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
      this.$store.commit('setErrMsg', "")
    },
    togglePasswordReset() {
        if (this.showForgotPassword) {
            this.showLoginForm = true
            this.showForgotPassword = false
            this.$store.commit('setPasswordResetSuccess', false)
            this.$store.commit('setErrMsg', "")
            this.passwordForm.email = ""
        } else {
            this.showLoginForm = false
            this.showForgotPassword = true
        }
    },
    resetPassword() {
      this.$store.dispatch('resetPassword', this.passwordForm.email)
    },
    login() {
      let objUser = {
        email:this.loginForm.email,
        pwd:this.loginForm.password
      }
      this.$store.dispatch('login', objUser)
    },
    signup() {
     let newUser = {
        email:this.signupForm.email,
        pwd:this.signupForm.password,
        name: this.signupForm.name,
        title: this.signupForm.title
      }
      this.$store.dispatch('signup', newUser)
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-style: italic;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 20px;
}
</style>