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
                <p class="aboutMe">À propos de moi: </p>
                <div class="biography">
                    
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

            <div class="posts">
                <button :class="{ hidden: isHidden }" @click="getUserPosts">Afficher mes publications</button>
                <ul>
                    <li class="list-element" v-for="post in posts" :key="post.id">
                        <SinglePost :post="post"/>
                    </li>
                </ul>
            </div>
            
        </div>

        <div v-else class="container">
            <div class="profile">
                <div class="profile_picture">
                    <div>
                        <img src="../../public/images/default_profile_picture.jpg" alt="">
                    </div>
                </div>
                <p class="aboutMe">À propos de {{ username }}: </p>
                <div class="biography">
                    <div class="biography_text">
                        <p>{{ registeredBiography }}</p>
                    </div>
                </div>
            </div>
            <div v-if="this.$store.state.userObject.isAdmin == true" class="posts">
                <button :class="{ hidden: isHidden }" @click="getUserPosts">Afficher les publications</button>
                <ul>
                    <li class="list-element" v-for="post in posts" :key="post.id">
                        <SinglePost :post="post"/>
                    </li>
                </ul>
            </div>
        </div>
    <Footer />
    </div>
</template>

<script>
import TopBanner from '@/components/TopBanner'
import SinglePost from '@/components/posts/SinglePost'
import Footer from '@/components/Footer'
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
            userObject: this.$store.state.userObject,
            posts: [],
            alreadyPosted: [],
            postsDisplayed: false,
            isHidden: false
        }
    },
    components: {
        TopBanner,
        SinglePost,
        Footer
    },
    methods: {
        hideButton() {

        },
        // Upload profile picture
        onFileSelected(event) {
            this.profileImage = event.target.files[0]
        },
        saveProfilePicture() {
            axios.put(this.$store.state.URL + 'users/' + this.$store.state.userObject.id, {
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
            axios.delete(this.$store.state.URL + 'users/' + this.$store.state.userObject.id, {
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
            axios.put(this.$store.state.URL + 'users/' + this.$store.state.userObject.id, {
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
                axios.get(this.$store.state.URL + 'posts/byAuthor/' + this.$route.params.profileToLoad, {
                    headers: {
                        'Authorization': this.$store.state.token
                    },
                })
                .then((response) => {
                    if(response.status == 200){
                        for(let i=0; i<response.data.length; i++){
                            const thisPost = response.data[i]
                            thisPost.arrayOfReactions = this.createArrayOfReactions(thisPost);
                            this.posts.push(thisPost);
                            this.isHidden = true;
                        }
                        this.postsDisplayed = true
                    }else{
                        console.log('Erreur lors de l\'obtention des publications utilisateur')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },

        createArrayOfReactions(post) {
            let reactions = {
                likes: [],
                dislikes: []
            }

            for (let i=0; i<post.reactions.length; i++){
                if(!reactions.likes.includes(post.reactions[i].authorId) && !reactions.dislikes.includes(post.reactions[i].authorId)){
                    if(post.reactions[i].reaction == 1){
                        reactions.likes.push(post.reactions[i].authorId)
                    }else if(post.reactions[i].reaction == 0){
                        reactions.dislikes.push(post.reactions[i].authorId)
                    }else{
                        console.log('erreur de la fonction: createArrayOfReactions()')
                    }
                }else if(reactions.likes.includes(post.reactions[i].authorId)){
                    this.removeElementFromArray(reactions.likes, post.reactions[i].authorId)
                }else if(reactions.disllikes.includes(post.reactions[i].authorId)){
                    this.removeElementFromArray(reactions.dislikes, post.reactions[i].authorId)
                }else{
                    console.log('erreur de la fonction: createArrayOfReactions()')
                }
            }
            return reactions
        },
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
        max-width: 50%;
        min-width: 50%;


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
    & .aboutMe{
        font-weight: bold;
        margin-top: 15px;
    }   

        & .biography{
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 20vh;
            margin: 20px 0;
            padding: 10px;
            overflow: auto;
            border: .1em solid rgba(0, 0, 0, 0.1);

            &::-webkit-scrollbar {
                width: .2em;
            }
            &::-webkit-scrollbar-track {
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
            }
            
            &::-webkit-scrollbar-thumb {
                background-color: darkgrey;
                outline: 1px solid slategrey;
            }

            @media screen and(max-width: 767px){
                margin-top: 3em;
                width: 100%;
            }

            &_text p{
                margin: 0;
            }

        }

        & .editBiography{

            position: relative;

            & textarea{
                width: 100%;
                height: 100px;
                box-sizing: border-box;
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

    & .posts{
        min-width: 50%;
        max-height: 60vh;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        &::-webkit-scrollbar {
            width: .2em;
        }
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: darkgrey;
            outline: 1px solid slategrey;
        }

        & ul{
            min-width: 90%;
            max-height: 100%;
            padding-inline-start: 0;  
            list-style-type: none;
            padding: 15px;

            & .list-element{
                position: relative;
                display: flex;
                flex-direction: column;
                background-color: #557d96;
                border-radius: 10px 10px;
                margin: 0 0 30px 0;
                box-shadow: 1px 1px 9px rgb(49, 54, 78);
            }
        }
    }

    
}

.hidden {
    display: none;
}

</style>