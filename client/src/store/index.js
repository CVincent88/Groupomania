import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
state: {
    homelink: "/",
    AccountSettingLink: "/AccountSetting",
    images: {
        logo: "Logo Groupomania"
    },
    state: {
        authenticated: sessionStorage.getItem('authenticated')
    }
},
mutations: {
},
actions: {
},
modules: {
}
})
