import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Connection from '../views/Connection.vue'
import AccountSetting from '../views/AccountSetting.vue'

Vue.use(VueRouter)

const routes = [
{
    path: '/',
    name: 'Connection',
    component: Connection
},
{
    path: '/Home',
    name: 'Home',
    component: Home
//   route level code-splitting
//   this generates a separate chunk (about.[hash].js) for this route
//   which is lazy-loaded when the route is visited.
},
{
    path: '/AccountSetting',
    name: 'AccountSetting',
    component: AccountSetting
}
]

const router = new VueRouter({
    routes   
})

export default router