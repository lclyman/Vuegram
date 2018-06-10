<template>
    <header>
        <section>
            <div class="col1">
                <router-link to="dashboard"><h3>Vuegram</h3></router-link>
                <ul class="inline">
                    <li><router-link to="dashboard">Dashboard</router-link></li>
                    <li><router-link to="settings">Settings</router-link></li>
                    <li><a @click="logout">logout</a></li>
                </ul>
            </div>
        </section>
    </header>
</template>

<script>
import { auth } from "@/firebase/init.js"

export default {
  methods: {
    logout() {
      auth.signOut()
        .then(() => {
          this.$store.dispatch("clearData")
          this.$router.push("/login")
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
