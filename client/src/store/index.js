import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

export default new Vuex.Store({
state: {
    homelink: "/",
    AccountSettingLink: "/AccountSetting",
    images: {
        logo: "Logo Groupomania"
    }
},
mutations: {
    [LOGIN] (state) {
        state.pending = true;
    },
    [LOGIN_SUCCESS] (state) {
        state.isLoggedIn = true;
        state.pending = false;
    },
    [LOGOUT](state) {
        state.isLoggedIn = false;
    }
},
actions: {
    login({ commit }, options) {
        if(options.emailAddress != "" && options.password != ""){
            commit(LOGIN); // show spinner
            return new Promise(resolve => {
                axios.post(options.URL + 'login', {
                    emailAddress: options.emailAddress,
                    password: options.password
                })
                .then((response) => {
                    console.log(`User connection info: `);
                    console.log(response);
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userId", response.data.userId);
                    commit(LOGIN_SUCCESS);
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                })
            });
        }
    },
    logout({ commit }) {
        // localStorage.removeItem("token");
        localStorage.clear();
        commit(LOGOUT);
    }
},
getters: {
    isLoggedIn: state => {
        return state.isLoggedIn
    }
},
modules: {
}
})
