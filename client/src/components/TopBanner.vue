<template>
    <div>
        <div class="container">
            <hide-at :breakpoints="{medium: 600}" breakpoint="mediumAndBelow">
                <div class="homelink">
                    <router-link to="/Home" class="homelink_content">
                        <img src="../assets/icon.svg" alt="Icone Groupomania">
                        <h1>Groupomania</h1>
                    </router-link>
                </div>
            </hide-at>
            <show-at :breakpoints="{medium: 600}" breakpoint="mediumAndBelow">
                <div class="homelink">
                    <router-link to="/Home" class="homelink_content">
                        <img src="../assets/icon.svg" alt="Icone Groupomania">
                    </router-link>
                </div>
            </show-at>


            <div class="account">
                <router-link :to="{ name: 'ProfilePage', params: { profileToLoad } }" class="profile-link">Mon profil</router-link>
                <div @click="logout">
                    <router-link class="logout" to="/" >Déconnexion</router-link>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import {showAt, hideAt} from 'vue-breakpoints'

export default {
    name: 'TopBanner',
    data() {
        return {
            profileToLoad: this.$store.state.userObject.id,
            userName: '',
        }
    },
    components: {
        hideAt, 
        showAt 
    },
    methods: {
        logout() {
            localStorage.clear();
            // this.$store.state.loadedProfilePage = {}
            location.reload()
        }
    }
}
</script>
import {showAt, hideAt} from 'vue-breakpoints'

<style lang="scss" scoped>

.container {
    width: 100%;
    background-color:#557d96;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;

    & .homelink{
        position: relative;
        flex-grow: 1;

        &_content{
            line-height: 0;
            display: flex;
            justify-content: center;
            color: #FFFFFF;
            text-decoration: none;
            transition: color .3s;
            &:hover{
            color: #ff5c67;
            }

            & img{
                height: 2.5em;
            }

        }
    }

    & .account{
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        width: 20%;
        justify-content: space-around;

        @media screen and(max-width: 600px){
            flex-grow: 3;
        }

        & .profile-link{
            color: #FFFFFF;
            text-decoration: none;
            transition: color .3s;

            &:hover{
                color: #000000;
            }
        }

        & .logout{
            color: #FFFFFF;
            text-decoration: none;
            transition: color .3s;

            &:hover{
                color: #fd3131 ;
            }        
        }
    }
}
</style>