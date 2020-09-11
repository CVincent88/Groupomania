<template>
    <div class="wrapper">
        <TopBanner/>
        <div v-if="this.$route.params.profileToLoad == this.myUserId" class="container">
            <h1>Mon profil</h1>
            <div class="profile">
                <div class="profile_picture">
                    <div>
                        <img src="../../public/images/default_profile_picture.jpg" alt="">
                        <input 
                        type="file"
                        style="display: none"
                        @change="onFileSelected" 
                        ref="fileInput">
                        <button @click="$refs.fileInput.click()">Choisir</button>
                        <button @click="saveProfilePicture">Upload</button>
                    </div>
                </div>

                <div class="biography">
                    <p class="aboutMe">À propos de moi: </p>
                    <div class="biography_text">
                        <p>{{ registeredBiography }}</p>
                    </div>
                </div>

                <div class="editButtons">
                    <button class="modifyBiography" @click="openModifyBiography">Modifier ma biographie</button>
                    <button class="deleteAccount" @click="deleteAccount">Supprimer mon compte</button>
                </div>

                <div v-show="modifyBiography">
                    <textarea id="biographyTextBox" name="Biography" cols="30" rows="10" v-model="newBiography"></textarea>
                    <button @click="submitBiography">Soumettre</button>
                </div>
            </div>
            
        </div>

        <div v-else>
            <div class="profile">
                <div class="profile_picture">
                    <div>
                        <img src="../../public/images/default_profile_picture.jpg" alt="">
                    </div>
                </div>

                <div class="biography">
                    <p class="aboutMe">À propos de {{ username }}: </p>
                    <div class="biography_text">
                        <p>{{ registeredBiography }}</p>
                    </div>
                </div>

                <div v-if="this.isAdmin == 'true'">
                    <h2>Posts de {{ username }}</h2>
                    <div class="user">
                        <button @click="getUserPosts">Afficher les posts de {{ username }}</button>
                        
                        <li class="single-post" v-for="post in posts" :key="post.id">

                            <div class="post-content-box">
                                <p class="post-content">{{ post.content }}</p>
                            </div>
                            <div class="users-reactions">
                                <div class="likes">
                                    <button class="like-button reaction-button">J'aime</button>
                                    <span class="like-number reaction-number">{{ post.like }}1</span>
                                </div>
                                <span>|</span>
                                <div class="dislikes">
                                    <button class="dislike-button reaction-button">Je n'aime pas</button>
                                    <span class="dislike-number reaction-number">{{ post.dislike }}1</span>
                                </div>
                            </div>
                        </li>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import TopBanner from '../components/TopBanner.vue'
import axios from 'axios'

export default {
    name: 'ProfilePage',
    data() {
        return {
            modifyBiography: false,
            newBiography: '',
            registeredBiography: '',
            newProfilePicture: '',
            myUserId: localStorage.getItem('myUserId'),
            isAdmin: localStorage.getItem('isAdmin'),
            username: '',
            posts: [],
        }
    },
    components: {
        TopBanner
    },
    methods: {
        // Upload profile picture
        onFileSelected(event) {
            this.profileImage = event.target.files[0]
            console.log(this.profileImage)
        },
        saveProfilePicture() {
            axios.put(this.$store.state.URL + 'users/' + localStorage.getItem('myUserId'), {
                profileImage: this.profileImage
            },
            {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then((response) => {
                console.log(response)
            })
        },
        // Delete account
        deleteAccount() {
            axios.delete(this.$store.state.URL + 'users/' + localStorage.getItem('myUserId'), {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then(() => {
                localStorage.clear();
                this.$router.push('/');
            })
        },
        // Modify biography
        submitBiography() {
            axios.put(this.$store.state.URL + 'users/' + localStorage.getItem('myUserId'), {
                biography: this.newBiography  
            },
            {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then(() => {
                this.modifyBiography = false;
                this.registeredBiography = this.newBiography;
            })
        },
        openModifyBiography() {
            this.modifyBiography = true
        },
        // Obtenir les posts de l'utilisateur
        getUserPosts() {
            axios.get(this.$store.state.URL + 'users/' + this.$route.params.profileToLoad + '/posts', {
                headers: {
                    'Authorization': this.$store.state.token
                },
            })
            .then((response) => {
                this.$store.state.posts.push(...response.data.publications);
                console.log(this.$store.state.posts)
            })
        }
    },
    // Loads the user's biography
    beforeMount() {
        axios.get(this.$store.state.URL + 'users/' + this.$route.params.profileToLoad, {
            headers: {
                'Authorization': this.$store.state.token
            },
        })
        .then((res) => {
            this.registeredBiography = res.data.biography;
            this.profileImage = res.data.profileImage;
            this.username = res.data.firstName + ' ' + res.data.lastName
        })
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
            max-width: 100px;

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