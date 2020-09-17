<template>
<div>
    <li class="single-post" v-for="post in this.$store.state.posts" :key="post.id">
        <div class="user">
            <img class="profile-picture" src="../../../public/images/default_profile_picture.jpg" alt="Default profile picture">
            <router-link :to="{ 
                name: 'ProfilePage', 
                params: { profileToLoad: JSON.stringify(post.author.id) }}" 
                class="profile-link">
                {{ `${post.author.firstName} ${post.author.lastName}` }}
            </router-link>
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
        removeFromArray(array, value){
            return array.filter(function(newTable){
                return newTable != value; 
            })
        },
        createarrayOfReactionss(post) {
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
                        console.log('erreur de la fonction: createarrayOfReactionss()')
                    }
                }else if(reactions.likes.includes(post.reactions[i].authorId)){
                    this.removeFromArray(reactions.likes, post.reactions[i].authorId)
                }else if(reactions.disllikes.includes(post.reactions[i].authorId)){
                    this.removeFromArray(reactions.dislikes, post.reactions[i].authorId)
                }else{
                    console.log('erreur de la fonction: createarrayOfReactionss()')
                }
            }
            return reactions
        },
        doILike(post){
            const userId = this.userObject.id;

            if(post.arrayOfReactions.likes.length > 0){
                for(let i=0; i<post.arrayOfReactions.likes.length; i++){
                    if(post.arrayOfReactions.likes[i] == userId){
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

            if(post.arrayOfReactions.dislikes.length > 0){
                for(let i=0; i<post.arrayOfReactions.dislikes.length; i++){
                    if(post.arrayOfReactions.dislikes[i] == userId){
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
                    thisPost.arrayOfReactions = this.createarrayOfReactionss(thisPost);
                    
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
                if(!post.arrayOfReactions.likes.includes(this.userObject.id)){
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
                        post.arrayOfReactions.likes.push(this.userObject.id)
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
                        post.arrayOfReactions.likes = this.removeFromArray(post.arrayOfReactions.likes, this.userObject.id)
                    })
                }

            }else if (reaction == 0){

                // If he has not already disliked the post, we create a new Dislike entry in the database
                if(!post.arrayOfReactions.dislikes.includes(this.userObject.id)){
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
                        post.arrayOfReactions.dislikes.push(this.userObject.id)

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
                        post.arrayOfReactions.dislikes = this.removeFromArray(post.arrayOfReactions.dislikes, this.userObject.id)
                    })
                }

            }

        }
    
    }
}
</script>

<style lang="scss" scoped>

.single-post{
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #557d96;
    border-radius: 10px 10px;
    margin: 0 0 30px 0;
    padding: 10px;
    box-shadow: 1px 1px 9px rgb(49, 54, 78);
}

.loading {
    text-align: center;
    position: absolute;
    color: #ffffff;
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

</style>