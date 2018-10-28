import Vue from 'vue'
import router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Welcome from '@/components/Welcome'
import Chat from '@/components/Chat'
import firebase from 'firebase/app'
import 'firebase/auth'


Vue.use(router)

export default new router({
  routes: [
    {
      path: '*',
      redirect: '/welcome'
    },
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signup',
      component: Signup
    },
    {
      name: 'welcome',
      path: '/welcome',
      component: Welcome,
      beforeEnter: (to, from, next) => {
        let currentUser = firebase.auth().currentUser;
        let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        if (requiresAuth && !currentUser){
          next('login');
        }
        else if (!requiresAuth && currentUser)
          next('welcome')
        else
          next()
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'chat',
      path: '/chat/:name',
      component: Chat,
      beforeEnter: (to, from, next) => {
        let currentUser = firebase.auth().currentUser;
        let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        if (requiresAuth && !currentUser){
          next('login');
        }
        else if (!requiresAuth && currentUser)
          next('welcome')
        else
          next()
      },
      meta: {
        requiresAuth: true
      }
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   let currentUser = firebase.auth().currentUser;
//   let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//
//   if (requiresAuth && !currentUser)
//     next('login')
//   else if (!requiresAuth && currentUser)
//     next('welcome')
//   else
//     next()
// })
