<template>
    <div>
        <div class="container">
            <div class="homelink">
                <router-link to="/Home" class="homelink_content">
                    <img src="../assets/icon.svg" alt="Icone Groupomania">
                    <h1>Groupomania</h1>
                </router-link>
            </div>


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

export default {
    name: 'TopBanner',
    data() {
        return {
            profileToLoad: localStorage.getItem('myUserId'),
            userName: '',
            userObject: JSON.parse(localStorage.getItem('userObject'))
        }
    },
    methods: {
        logout() {
            localStorage.clear();
        }
    }
}
</script>

<style lang="scss" scoped>

.container {
    width: 100%;
    height: 3em;
    background-color:#557d96;
    display: flex;
    align-items: center;
    justify-content: center;

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