<template>
    <div class="wrapper">
        <TopBanner/>

        <div v-if="this.$route.params.profileToLoad == this.userObject.id" class="container">
            <h1>{{ loadedProfile.firstName }} {{ loadedProfile.lastName }}</h1>
            <div class="content">
                <div class="profile">
                    <div class="profile_picture">
                        <div>
                            <img v-if="newProfilePicture == ''" :src="require(`../../../backend/images/${this.profilePicture}`)" alt="Profile picture">
                            <img v-else-if="newProfilePicture != '' && file != ''" :src="newProfilePicture" alt="Profile picture">
                            <input 
                            id="file"
                            type="file"
                            style="display: none"
                            @change="handleFileUpload()" 
                            ref="file">
                            <span v-if="this.newProfilePictureName != ''">{{ this.newProfilePictureName }}</span>
                            <button @click="$refs.file.click()">Choisir</button>
                            <button @click="submitFile()">Upload</button>
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
                    <button class="posts_display" :class="{ hidden: isHidden }" @click="getUserPosts">Afficher mes publications</button>
                    <ul>
                        <li class="list-element" v-for="post in posts" :key="post.id">
                            <SinglePost :post="post"/>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>

        <div v-else class="container">
            <h1>{{ loadedProfile.firstName }} {{ loadedProfile.lastName }}</h1>
            <div class="content">
                <div class="profile">
                    <div class="profile_picture">
                        <div>
                            <img :src="require(`../../../backend/images/${this.profilePicture}`)" alt="">                        </div>
                    </div>
                    <p class="aboutMe">À propos de {{ loadedProfile.firstName }} {{ loadedProfile.lastName }}: </p>
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
            username: '',
            userObject: this.$store.state.userObject,
            posts: [],
            postsDisplayed: false,
            isHidden: false,
            loadedProfile: {},
            file: '',
            profilePicture: '',
            profileImageUrl: '',
            newProfilePicture: '',
            newProfilePictureName: '',
        }
    },
    components: {
        TopBanner,
        SinglePost,
        Footer
    },
    props: {
        profileToLoad: Object
    },
    methods: {
        // Upload profile picture
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
            const fileName = URL.createObjectURL(this.file)
            this.newProfilePicture = fileName
            this.newProfilePictureName = this.file.name
        },

        submitFile(){
            // Impossible to have Axios work with FormData, therefore, used fetch() instead.

            const formData = new FormData();
            formData.append('profilePicture', this.file);

            fetch(this.$store.state.URL + 'users/' + this.$store.state.userObject.id, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
                .then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                    this.newProfilePictureName = ''
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        deleteAccount() {
            axios.delete(this.$store.state.URL + 'users/' + this.$store.state.userObject.id, {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then(() => {
                this.$store.state.posts = [];
                localStorage.clear();
                this.$router.push('/');
            })
            .catch((err) => {
                console.log(err)
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
            this.loadedProfile = res.data
            this.profilePicture = res.data.profileImage.split('images/')[1];
            this.registeredBiography = res.data.biography;
            this.profileImage = res.data.profileImage;
            this.username = res.data.firstName + ' ' + res.data.lastName
        });
    }
}
</script>

<style lang="scss" scoped>

.container{

    & .content{
        display: flex;
        width: 95%;
        justify-content: space-around;
        align-items: center;
        margin: auto;
        min-height: calc(100vh - (4rem + 4.3rem + 2.5rem + 2.5rem));
        font-size: 1.6em;

        @media screen and(max-width: 768px){
            flex-direction: column;
            align-items: center;
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

                & button{
                    min-height: 40px;
                    border: 0;
                    border-radius: 3px;
                    color: #FFFFFF;
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;

                    @media screen and(max-width: 500px) {
                        font-size: 1em;
                    }

                }

                & .modifyBiography{
                    background-color: rgb(37, 162, 219);
                    margin: 15px;
                }

                & .deleteAccount{
                    background-color: rgb(206, 0, 0);
                }
            }
        }

        & .posts{
            min-width: 50%;
            max-height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            @media screen and(max-width: 768px) {
                width: 99%;
                max-height: 90vh;
            }

            &_display{
                height: 40px;
                border: 0;
                border-radius: 3px;
                background-color: #557D96;
                color: #ffffff;
                font-size: 1.2em;
                font-weight: bold;
                cursor: pointer;
                margin: 15px;
            }


            & ul{
                min-width: 90%;
                height: 100%;
                padding-inline-start: 0;  
                list-style-type: none;
                padding: 15px;
                overflow: auto;

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
    

    
}

.hidden {
    display: none;
}

</style>