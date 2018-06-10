<template>
    <div id="app">
        <navBar v-if="currentUser"></navBar>
    	<router-view/>
    </div>
</template>

<script>
import { mapState } from "vuex"
import navBar from "./components/Navigation.vue"
import { auth, usersCollection } from "@/firebase/init.js"

export default {
  created() {
    if (!this.currentUser) {
      this.$router.push("/login")
    }

    // auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.commit("setCurrentUser", user)
    //     this.$store.dispatch("fetchUserProfile")

    //     usersCollection.doc(user.uid).onSnapshot(doc => {
    //       store.commit("setUserProfile", doc.data())
    //     })
    //   }
    // })
  },
  components: { navBar },
  computed: {
    ...mapState(["currentUser"])
  }
}
</script>