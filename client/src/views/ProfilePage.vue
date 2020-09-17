<template>
    <div class="wrapper">
        <TopBanner/>
        <h1>{{ userObject.firstName }} {{ userObject.lastName }}</h1>

        <div v-if="this.$route.params.profileToLoad == this.userObject.id" class="container">
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
                
                <div v-show="modifyBiography" class="editBiography">
                    <textarea id="biographyTextBox" name="Biography" cols="30" rows="10" v-model="newBiography"></textarea>
                    <button @click="submitBiography">Soumettre</button>
                </div>

                <div class="editButtons">
                    <button class="modifyBiography" @click="openModifyBiography">Modifier ma biographie</button>
                    <button class="deleteAccount" @click="deleteAccount">Supprimer mon compte</button>
                </div>
            </div>

            <div class="myPosts">
                <button @click="getUserPosts">Afficher mes publications</button>
                <li class="single-post" v-for="post in posts" :key="post.id">
                    <div class="user">
                        <img class="profile-picture" src="../../public/images/default_profile_picture.jpg" alt="Default profile picture">
                        <!-- <span class="profile-link">
                            {{ `${post.author.firstName} ${post.author.lastName}` }}
                        </span> -->
                    </div>
                    <div class="post-content-box">
                        <p class="post-content">{{ post.content }}</p>
                    </div>
                    <div class="users-reactions">
                        <div class="likes">
                            <font-awesome-icon icon="thumbs-up" :class="doILike(post) ? 'like-highlight' : ''" class="icon" @click="reactOnPost(post, 1)"/>

                            <span v-show="post.arrayOfReactions.likes.length > 0" class="like-number reaction-number">{{ post.arrayOfReactions.likes.length }}</span>
                        </div>
                        <div class="dislikes">
                            <font-awesome-icon icon="thumbs-down" :class="doIDislike(post) ? 'dislike-highlight' : 'empty'" class="icon" @click="reactOnPost(post, 0)"/>
                            
                            <span v-show="post.arrayOfReactions.dislikes.length > 0" class="dislike-number reaction-number">{{ post.arrayOfReactions.dislikes.length }}</span>
                        </div>
                    </div>
                </li>
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

                <div v-if="1 == 1">
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
    <Footer />
    </div>
</template>

<script>
import TopBanner from '../components/TopBanner'
import Footer from '../components/Footer'
import axios from 'axios'

export default {
    name: 'ProfilePage',
    data() {
        return {
            modifyBiography: false,
            newBiography: '',
            registeredBiography: '',
            newProfilePicture: '',
            username: '',
            userObject: JSON.parse(localStorage.getItem('userObject')),
            posts: [],
            postsDisplayed: false
        }
    },
    components: {
        TopBanner,
        Footer
    },
    methods: {
        // Upload profile picture
        onFileSelected(event) {
            this.profileImage = event.target.files[0]
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
            if(this.postsDisplayed == false){
                axios.get(this.$store.state.URL + 'users/' + this.$route.params.profileToLoad + '/posts', {
                    headers: {
                        'Authorization': this.$store.state.token
                    },
                })
                .then((response) => {
                    this.posts.push(...response.data.publications);
                    this.postsDisplayed = true
                })
            }
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
    display: flex;
    width: 95%;
    justify-content: space-around;
    margin: auto;

    @media screen and(max-width: 767px){
        width: 95%;
    }

    & .profile{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;


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
            width: 100%;
            margin: 20px 0;

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

        & .editBiography{

            position: relative;

            & textarea{
                width: 100%;
                height: 100px;
                box-sizing: border-box;
                // border-radius: 10px 10px;
                border: none;
                padding: 10px 10px;
                resize: none;


                &:focus{
                    outline: 1px solid #347BE7;
                }
            }

            & button{
                position: absolute;
                bottom: 0;
                right: 0;
                margin: 10px;
                border: none;
                border-radius: 4px 4px;
                outline: 0;
                background-color: #347BE7;
                padding: 5px;
                cursor: pointer;

            }
        }

        & .editButtons{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px;

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

    & .myPosts{
        max-height: 50vh;
        overflow: auto;
        display: flex;
        flex-direction: column;

        & .single-post{
            position: relative;
            display: flex;
            flex-direction: column;
            background-color: #557d96;
            border-radius: 10px 10px;
            margin: 0 0 30px 0;
            padding: 10px;
            box-shadow: 1px 1px 9px rgb(49, 54, 78);

            & .user{
                display: flex;
                align-items: center;
                text-align: start;

                & .profile-link{
                    text-decoration: none;
                    padding-left: 5px;
                    color: #FFFFFF;

                    &:hover{
                        color: blue;
                    }
                }

                & .profile-picture{
                    width: 30px;
                    height: 30px;
                    border-radius: 5px 5px;
                }

                &_username{
                    margin: 0 10px;
                }
            }

            .post-content-box{
                text-align: start;
                margin-bottom: 15px;

                & .post-content{
                    color: #FFFFFF;
                }
            }

            .users-reactions{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                background-color:  #7fb1d1;
                border-radius: 0 0 10px 10px;
                padding: 5px 0;

                & > * .icon{
                    cursor: pointer;
                }

            }

            .like-highlight{
                color: rgb(49, 114, 255);
            }

            .dislike-highlight {
                color: rgb(247, 70, 17);
            }
        }
    }

    
}

</style>