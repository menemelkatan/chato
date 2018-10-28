<template lang="html">

    <div class="welcome">
      <h1>
        Start chating now with any user
      </h1>

      <ul class="users-list">
        <li v-for="user in users">
          <router-link v-bind:to="{name: 'chat', params: {name: user.name}}">
              {{user.name}}
          </router-link>
        </li>
      </ul>
    </div>

</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'Welcome',
  data () {
    return {
      users: []
    }
  },
  methods: {
    getAllUsers: function(){
      var currentUser = firebase.auth().currentUser.email;
      console.table(currentUser)
      firebase.firestore().collection("users").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            if(currentUser !== doc.data().name)
              this.users.push(doc.data());
        });
      });
    }
  },
  created: function() {
    this.getAllUsers();
  }
}
</script>

<style lang="css">
h1{
  color: white;
  margin: 0 auto;
  padding: 50px;
  text-shadow: 1px 1px 0px black
}
.users-list{
  list-style-type: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-x: hidden;
}
.users-list li{
  text-align: center;
  margin: 10px
}
.users-list li a{
  color: black;
  background: white;
  text-decoration: none;
  width: 250px;
  padding: 20px 0;
  text-align: center;
  display: block;
}
.users-list li a:hover{
  color: white;
  background: black;
}
</style>
