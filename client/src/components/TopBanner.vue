<template>
    <div>
        <div class="home-page">
            <router-link to="/" class="profile-link">
                <img src="../assets/icon.svg" :alt="$store.state.images.logo">
            </router-link>
            <div class="search-bar">
                <input type="text" placeholder="Rechercher">
            </div>

            <router-link to="/AccountSetting" class="profile-link">Mon profil</router-link>

            <router-link @click="logout" to="/" >Déconnexion</router-link>
        </div>
    </div>
</template>

<script>

export default {
    name: 'TopBanner',
    methods: {
        // logout() {
        //     this.$store.dispatch('logout');
        // }
        logout() {
            window.localStorage.clear();
        }
    }
}
</script>

<style lang="scss" scoped>

.connection-page{
    background-color: rgb(40, 108, 209);
    height: 4.5em;
    width: 100%;

    &_logo{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        & a img{
        height: 50px;
        }
    }
}

.home-page {
    width: 100%;
    height: 42px;
    background-color: rgb(40, 108, 209);
    display: flex;
    align-items: center;
    justify-content: center;

    & a img{
        height: 32px;
        width: 32px;
        margin: 0 5px 0 0;
    }

    & .search-bar{
        width: 400px;

        & input{
        width: 100%;
        height:20px
        }
    }

    & .profile-link{
        margin: 0 15px 0 30px;
        text-decoration: none;
        color: white;
        
        &:hover{
        text-decoration: underline;
        }
    }

    & button{
        height: 30px;
        border: 1px solid rgb(37, 99, 192);
        background-color: rgb(52, 123, 231);
        font-weight: bold;
        cursor: pointer;
        color: white;
    }
}
</style>