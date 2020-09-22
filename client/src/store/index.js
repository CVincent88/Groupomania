import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)


const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

export default new Vuex.Store({
    plugins:[createPersistedState()],
state: {
    homelink: "/",
    images: {
        logo: "Logo Grouposcape"
    },
    token: '',
    URL: 'http://localhost:5000/api/v1/',
    posts: [],
    userObject: {},
    loadedProfilePage: {},
    isAdmin: false,
    profilePicture: ''
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
            return new Promise((resolve, reject) => {
                axios.post(options.URL + 'login', {
                    emailAddress: options.emailAddress,
                    password: options.password
                })
                .then((response) => {
                    this.state.token = `Bearer ${response.data.token}`
                    this.state.userObject = response.data.user
                    commit(LOGIN_SUCCESS);
                    resolve(response);
                })
                .catch(error => {
                    reject(error.response);
                })
            });
        }
    },
    logout({ commit }) {
        localStorage.clear();
        commit(LOGOUT);
    }
},
getters: {
    isLoggedIn: state => {
        return state.isLoggedIn
    }
}
})
