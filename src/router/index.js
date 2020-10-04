import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import store from '@/store.js';


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: "/destination/:slug",
    name: "DestinationDetails",
    component: ()=> import(/* webpackChunkName: "DestinationDetails" */"../views/DestinationDetails.vue" ),
    props: true,
    children: [
      {
        path: ":experienceSlug",
        name: "experienceDetails",
        props: true,
        component: ()=> import(/* webpackChunkName: "experienceDetails" */ "../views/Experiences.vue")
      }
    ]
    ,
    beforeEnter: (to, from, next)=>{
      const exists = store.destinations.find(
        destination => destination.slug === to.params.slug
      )
      if(exists){
        next()
      }else{
        next({name: "NotFound"})
      }
    }
  },
  {
    path: "/user",
    name: "User",
    component: ()=> import(/* webpackChunkName: "User" */"../views/User.vue" ),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: ()=> import(/* webpackChunkName: "Login" */"../views/Login.vue" )
  },
  {
    path: "/invoices",
    name: "invoices",
    component: () =>
      import(/* webpackChunkName: "Invoices" */ "../views/Invoices.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/404",
    alias: "*",
    name: "NotFound",
    component: ()=> import(/* webpackChunkName: "NotFound" */"../views/NotFound.vue" ),

  }
];

const router = new VueRouter({
  mode: "history",
  linkExactActiveClass: "vue-active-nav-class",
  scrollBehavior: (to, from , savedPosition)=>{
    if(savedPosition){
      return savedPosition;
    }else{
      const position = {};
      if(to.hash){
        position.selector = to.hash;
        if(to.hash === "#experience"){
          position.offset = {y:120}
        }
        if(document.querySelector(to.hash)){
          return position;
        }
        return false;
      }
    }
  },
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.user) {
      next({
        name: "Login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
