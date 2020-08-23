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
    user: {
        // userAuthenticated: true,
        userAuthenticated: false,
    }
},
mutations: {
},
actions: {
},
modules: {
}
})
