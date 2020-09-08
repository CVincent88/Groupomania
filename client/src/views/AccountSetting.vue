<template>
    <div class="wrapper">
        <TopBanner/>
        <div class="container">
            <h1>Mon profil</h1>
            <div class="profile">
                <div class="profile_picture">
                <img src="../../public/images/default_profile_picture.jpg" alt="Profile picture">
                <button class="modifyProfilePicture">Modifier</button>
                </div>

                <div class="biography">
                <p class="aboutMe">À propos de moi: </p>
                <div class="biography_text">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui, alias at optio nulla beatae, labore, recusandae ex temporibus laboriosam iusto repellendus aspernatur eius aut architecto facilis ipsum ut quasi corporis nemo delectus libero dolor praesentium. Voluptates ipsa dolorem deleniti tempora voluptatem quas vero eaque cum repellendus exercitationem. Impedit, unde quia.</p>
                </div>
                </div>
            </div>

            <div class="editButtons">
                <button class="modifyBiography">Modifier ma biographie</button>
                <button class="deleteAccount" @click="deleteAccount">Supprimer mon compte</button>
            </div>
        </div>

    </div>
</template>

<script>
import TopBanner from '../components/TopBanner.vue'
import axios from 'axios'

export default {
    name: 'AccountSetting',
    components: {
        TopBanner
    },
    methods: {
        deleteAccount() {
            axios.delete(this.$store.state.URL + 'users/' + localStorage.getItem('userId'), {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then((response) => {
                console.log(response)
                localStorage.clear();
                this.$router.push('/');
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.container{
    width: 75%;
    margin: auto;

    @media screen and(max-width: 767px){
        width: 95%;
    }

    & .profile{
        margin: 5em 0;
        display: flex;
        justify-content: center;
        align-items: center;

        @media screen and(max-width: 767px){
        flex-direction: column;
        margin-top: 2em;
        }

        &_picture{
            display: flex;
            flex-direction: column;

            & .modifyProfilePicture{
                margin-top: 20px;
            }

            & img{
                max-height: 100px;
                min-height: 75px;
            }
        }

        & .biography{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 70%;

            @media screen and(max-width: 767px){
                margin-top: 3em;
                width: 100%;
            }

            & .aboutMe{
                font-weight: bold;
                margin-top: 0;
            }

            &_text{
                max-width: 80%;

                & p{
                    margin: 0;
                }
            }

        }
    }

    & .editButtons{
        display: flex;
        flex-direction: column;
        align-items: center;

        & .modifyBiography{
            height: 40px;
            border: 0;
            border-radius: 3px;
            background-color: rgb(37, 162, 219);
            color: #FFFFFF;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            margin: 15px;
        }

        & .deleteAccount{
            height: 40px;
            border: 0;
            border-radius: 3px;
            background-color: rgb(206, 0, 0);
            color: #FFFFFF;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
        }
    }
}

</style>