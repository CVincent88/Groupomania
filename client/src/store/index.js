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
    ProfilePageLink: "/ProfilePage",
    images: {
        logo: "Logo Grouposcape"
    },
    token: `Bearer ${localStorage.getItem('token')}`,
    URL: 'http://localhost:5000/api/v1/',
    posts: []
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
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('myUserId', response.data.userId);
                    localStorage.setItem('isAdmin', response.data.user.isAdmin);
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
