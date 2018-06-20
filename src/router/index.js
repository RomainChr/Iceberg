import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Profile from '@/components/Auth/Profile'
import EditProfile from '@/components/Auth/EditProfile'
import Page404 from '@/components/Error/Page404'
import Icedrops from '@/components/Icedrop/Icedrops'
import Icedrop from '@/components/Icedrop/Icedrop'
import NewIceberg from '@/components/Iceberg/NewIceberg'
import NewIcedrop from '@/components/Icedrop/NewIcedrop'
import EditIceberg from '@/components/Iceberg/EditIceberg'
import EditIcedrop from '@/components/Icedrop/EditIcedrop'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/profile/:id",
      name: "Profile",
      component: Profile
    },
    {
      path: "/profile/:id/edit",
      name: "EditProfile",
      component: EditProfile
    },
    {
      path: "/new",
      name: "NewIceberg",
      component: NewIceberg
    },
    {
      path: "/edit",
      redirect: "/"
    },
    {
      path: "/edit/:id",
      name: "EditIceberg",
      component: EditIceberg
    },
    {
      path: "/:id",
      name: "Icedrops",
      component: Icedrops
    },
    {
      path: "/:id/new",
      name: "NewIcedrop",
      component: NewIcedrop
    },
    {
      path: "/:id/icedrop",
      redirect: "/:id"
    },
    {
      path: "/:iceberg_id/icedrop/:icedrop_id",
      name: "Icedrop",
      component: Icedrop
    },
    {
      path: "/:iceberg_id/icedrop/edit/:icedrop_id",
      name: "EditIcedrop",
      component: EditIcedrop
    },
    {
      path: "*",
      name: "Page404",
      component: Page404
    }
  ]
})
