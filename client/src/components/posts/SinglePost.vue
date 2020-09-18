<template>
<div class="wrapper">
    <div class="user">
        <div class="user_info">
            <img class="profile-picture" src="../../../public/images/default_profile_picture.jpg" alt="Default profile picture">
            <router-link :to="{ 
                name: 'ProfilePage', 
                params: { profileToLoad: JSON.stringify(post.author.id) }}" 
                class="profile-link">
                {{ `${post.author.firstName} ${post.author.lastName}` }}
            </router-link>
        </div>
        <div class="options">
            <font-awesome-icon icon="cog" v-if="userObject.id == post.authorId || this.$store.state.userObject.isAdmin == true"/>
        </div>

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
</div>
</template>


<script>
import axios from 'axios'

export default {
    name: 'SinglePost',
    props: {
        post: Object
    },
    data() {
        return {
            userObject: this.$store.state.userObject
        }
    },
    methods:{
        removeFromArray(array, value){
            return array.filter(function(newTable){
                return newTable != value; 
            })
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

.user{
    display: flex;
    justify-content: space-between;
    margin: 10px;

    &_info{
        display: flex;
        text-align: start;
        align-items: center;
    }

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
    margin:10px;

    & .post-content{
        color: #FFFFFF;
        margin: 0;
    }
}

.users-reactions{
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