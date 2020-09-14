<template>
<div>
    <li class="single-post" v-for="(post, index) in this.$store.state.posts"
        :key="post.id"
        :index="index+1">
        <p>{{ index }}</p>
        <div class="user">
            <img class="profile-picture" src="../../../public/images/default_profile_picture.jpg" alt="Default profile picture">
            <router-link :to="{
                name: 'ProfilePage', 
                params: { profileToLoad: JSON.stringify(post.author.id) }
            }" 
                class="profile-link">
                {{ `${post.author.firstName} ${post.author.lastName}` }}
            </router-link>
        </div>
        <div class="post-content-box">
            <p class="post-content">{{ post.content }}</p>
        </div>
        <div class="users-reactions">
            <div class="likes">
                <button :class="doILike(post) ? 'activated-button' : 'empty'" @click="reactOnPost(post, 1)" >J'aime</button>
                <span v-if="post.arrayOfReaction.likes.length > 0" class="like-number reaction-number">{{ post.arrayOfReaction.likes.length }}</span>
            </div>
            <div class="dislikes">
                <button :class="doIDislike(post) ? 'activated-button' : 'empty'" @click="reactOnPost(post, 0)" >Je n'aime pas</button>
                <span v-if="post.arrayOfReaction.dislikes.length > 0" class="dislike-number reaction-number">{{ post.arrayOfReaction.dislikes.length }}</span>
            </div>
        </div>
    </li>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
</div>
</template>


<script>
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'


export default {
    name: 'PostThread',
    props: {
        post: Object
    },
    components: {
        InfiniteLoading
    },
        data() {
        return {
            likeClass: [],
            alreadyPosted: [],
            error: '',
            loading: false,
            profileToLoad: 0,
            userObject: JSON.parse(localStorage.getItem('userObject'))
        }   
    },

    methods: {
        createArrayOfReactions(post) {
            let reactions = {
                likes: [],
                dislikes: []
            }

            for (let i=0; i<post.reactions.length; i++){
                if(post.reactions[i].reaction == 1){
                    reactions.likes.push(post.reactions[i].authorId)
                }else if(post.reactions[i].reaction == 0){
                    reactions.dislikes.push(post.reactions[i].authorId)
                }else{
                    console.log('error de condition')
                }
            }

            return reactions
        },
        doILike(post){
            const userId = this.userObject.id;

            if(post.arrayOfReaction.likes.length > 0){
                for(let i=0; i<post.arrayOfReaction.likes.length; i++){
                    if(post.arrayOfReaction.likes[i] == userId){
                        return true
                    }
                }
                return false
            }else{
                return false
            }
        },
        doIDislike(post){
            const userId = this.userObject.id;

            if(post.arrayOfReaction.dislikes.length > 0){
                for(let i=0; i<post.arrayOfReaction.dislikes.length; i++){
                    if(post.arrayOfReaction.dislikes[i] == userId){
                        return true
                    }
                }
                return false
            }else{
                return false
            }
        },


        // Infinite scroll
        infiniteHandler($state) {
            axios.get(this.$store.state.URL + 'posts/', {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            // The following code will display the post only if it has not already been displayed.
            .then((post) => {
                const thisPost = post.data[0];

                // Will check if the post id is already in the posts array
                const foundInPosts = this.$store.state.posts.find(element => element.id === thisPost.id);
                // Will check if the post id is already in the alreadyPosted array
                const foundInPosted = this.alreadyPosted.find(element => element.id === thisPost.id);
                
                // If the database is empty
                if (post.data.length < 1){
                    $state.complete();
                }

                // If it has not been displayed yet
                else if (!foundInPosts) {
                    
                    // On calcule le nombre de likes et dislikes
                    thisPost.arrayOfReaction = this.createArrayOfReactions(thisPost);
                    
                    // On enregistre
                    this.$store.state.posts.push(thisPost);
                    $state.loaded();

                // If it has been displayed but not registered in the alreadyPosted array
                }else if(foundInPosts && !foundInPosted){
                    this.alreadyPosted.push(thisPost);
                    $state.loaded();

                // If it has been displayed and registered in the alreadyPosted array
                }else if(foundInPosts && foundInPosted){
                    // If we have not displayed every post yet
                    if(this.alreadyPosted.length < this.$store.state.posts.length){
                        $state.loaded();
                    // If we have displayed every post
                    }else{
                        $state.complete();
                    }
                }
            });
        },

        // Like or dilike a post
        reactOnPost(post, reaction) {
            // If the user clicks on like button
            if(reaction == 1){

                // If he has not already liked the post, we create a new Like entry in the database
                if(!post.arrayOfReaction.likes.includes(this.userObject.id)){
                    axios.post(this.$store.state.URL + 'likes/', {
                        reaction: reaction,
                        authorId: this.userObject.id,
                        postId: post.id
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token
                        }
                    })
                    .then(() => {
                        console.log('Le like a été ajouté à la base de données')
                        // This line is here so that the button highlights immediately without another XHR
                        post.arrayOfReaction.likes.push(this.userObject.id)
                    })
                }else{

                    // Delete the like in the database
                    axios.delete(this.$store.state.URL + 'likes/', {
                        params: {
                            'authorId': this.userObject.id,
                            'postId': post.id   
                        }
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token,
                        }
                    })
                    .then(() => {
                        console.log('Le like a été supprimé de la base de données')
                        for(let i = 0; i < post.arrayOfReaction.likes.length; i++){ 
                            post.arrayOfReaction.likes.splice(i, this.userObject.id)
                        }
                    })
                }

            }else if (reaction == 0){

                // If he has not already disliked the post, we create a new Dislike entry in the database
                if(!post.arrayOfReaction.dislikes.includes(this.userObject.id)){
                    console.log('test 1')
                    axios.post(this.$store.state.URL + 'likes/', {
                        reaction: reaction,
                        authorId: this.userObject.id,
                        postId: post.id
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token
                        }
                    })
                    .then(() => {
                        // This line is here so that the button highlights immediately without another XHR
                        post.arrayOfReaction.dislikes.push(this.userObject.id)

                    })
                }else{

                    // Delete the like in the database
                    axios.delete(this.$store.state.URL + 'likes/', {
                        params: {
                            'authorId': this.userObject.id,
                            'postId': post.id   
                        }
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token,
                        }
                    })
                    .then(() => {
                        // This code is here so that the button highlights immediately without another XHR
                        for(let i = 0; i < post.arrayOfReaction.dislikes.length; i++){ 
                            post.arrayOfReaction.dislikes.splice(i, this.userObject.id)
                        }
                    })
                }

            }

        }
    
    }
}
</script>

<style lang="scss" scoped>

.single-post{
    display: flex;
    flex-direction: column;
    background-color: rgba(160, 174, 255, .2);
    border-radius: 10px 10px;
    margin: 0 0 30px 0;
    padding: 10px;
    box-shadow: 1px 1px 9px rgb(49, 54, 78);
}

.loading {
    text-align: center;
    position: absolute;
    color: #fff;
    z-index: 9;
    background: rgb(107, 107, 209);
    padding: 8px 18px;
    border-radius: 5px;
    left: calc(50% - 45px);
    top: calc(50% - 18px);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}

.user{
    display: flex;
    align-items: center;
    text-align: start;

    & .profile-link{
        text-decoration: none;
        padding-left: 5px;
        color: black;

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
}

.users-reactions{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.activated-button {
    background-color: red;
}

</style>