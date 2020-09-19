import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Connection from '../views/Connection.vue'
import ProfilePage from '../views/ProfilePage.vue'

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
    },
    {
        path: '/ProfilePage/:profileToLoad',
        name: 'ProfilePage',
        component: ProfilePage,
        props: {
            name: 'profileToLoad',
            default: '0',
            required: true
        }
    }
]

const router = new VueRouter({
    routes   
})

export default router