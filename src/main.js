import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


Vue.config.productionTip = false
let app;

var config = {
  apiKey: "AIzaSyDJQtDXtUvUx-jdKThCNfzQf9sqGCzcNjU",
  authDomain: "chato-1bcf6.firebaseapp.com",
  databaseURL: "https://chato-1bcf6.firebaseio.com",
  projectId: "chato-1bcf6",
  storageBucket: "chato-1bcf6.appspot.com",
  messagingSenderId: "317679360319"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);


firebase.auth().onAuthStateChanged(function(user) {

  if(!app){
    new Vue({
      render: h => h(App),
      router
    }).$mount('#app')
  }


})
