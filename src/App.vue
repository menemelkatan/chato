<template>
  <div id="app">
    <nav class="chato--nav">
      <ul>
        <li>
          <router-link to="/login" v-show="!loggedIn">Log IN</router-link>
        </li>
        <li>
          <router-link to="/signup" v-show="!loggedIn">Sign UP</router-link>
        </li>
        <li>
          <router-link to="/welcome" v-show="loggedIn">home</router-link>
        </li>
        <li>
          <a href="#!" v-on:click="logout" v-show="loggedIn">LogOUT</a>
        </li>
      </ul>
    </nav>
    <div class="chato-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'app',
  data () {
    return {
      loggedIn: false
    }
  },
  methods: {
   logout: function() {
     firebase.auth().signOut().then(() => {
       this.$router.push('/login')
     })
   }
 },
 created: function() {
   var user = firebase.auth().currentUser;
   if (user) {
     this.loggedIn = true
   } else {
     this.loggedIn = false
   }
 }
}
</script>

<style>
*{
  padding: 0;
  margin: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
.chato--nav{
  height: 10vh;
  width: 100%;
  background: white;
}
.chato--nav ul{
  display: flex;
  align-items: center;
  list-style-type: none;
  width: 100%;
}
.chato--nav ul li{
  margin: 0 5px;
  position: relative;
  width: 150px;
  height: 10vh;
}
.chato--nav ul li a{
  height: 100%;
  width: 100%;
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 6px solid orange;
  color: black;
  font-size: 12px;
}
.chato--nav ul li a:hover{
  color: white;
  background: orange;
}
.chato-view{
  height: 90vh;
  overflow-y: scroll;
}
</style>
