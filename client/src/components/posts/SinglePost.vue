<template>
<div class="wrapper">
    <div class="user">
        <div class="user_info">
            <img class="profile-picture" :src="require(`../../../../backend/images/${profilePicture}`)" alt="Default profile picture">
            <div @click="loadProfile(post.author)">
                <router-link :to="{ 
                    name: 'ProfilePage', 
                    params: { profileToLoad: post.author.id }}" 
                    class="profile-link">
                    {{ `${post.author.firstName} ${post.author.lastName}` }}
                </router-link>
            </div>
        </div>
        <div class="option-box">
            <font-awesome-icon icon="cog" v-if="userObject.id == post.authorId || this.$store.state.userObject.isAdmin == true" @click="openOptionBox(post.id)"/>
            <div :ref="post.id" class="options">
                <span class="options_delete" @click="deletePost(post.id, post.authorId)">Supprimer</span>
            </div>
        </div>

    </div>
    <div class="post-content-box">
        <p class="post-content">{{ post.content }}</p>
    </div>
    <div class="users-reactions">
        <div class="likes">
            <font-awesome-icon icon="thumbs-up" :class="doILike(post) ? 'like-highlight' : ''" class="icon" @click="reactOnPost(post, 1)"/>
            <span v-show="post.arrayOfReactions.likes.length > 0" class="like-number reaction-number"> {{ post.arrayOfReactions.likes.length }}</span>
        </div>
        <div class="dislikes">
            <font-awesome-icon icon="thumbs-down" :class="doIDislike(post) ? 'dislike-highlight' : 'empty'" class="icon" @click="reactOnPost(post, 0)"/>
            <span v-show="post.arrayOfReactions.dislikes.length > 0" class="dislike-number reaction-number"> {{ post.arrayOfReactions.dislikes.length }}</span>
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
            userObject: this.$store.state.userObject,
            profilePicture: this.post.author.profileImage.split('images/')[1]
        }
    },
    methods:{
        // Obtain the index of an object in an array
        arrayObjectIndexOf(myArray, property, searchTerm) {
            for(var i = 0; i < myArray.length; i++) {
                if (myArray[i][property] == searchTerm) return i;
            }
            return -1;
        },

        // Removes a value from an array
        removeElementFromArray(array, value){
            return array.filter(function(newTable){
                return newTable != value; 
            })
        },
        
        // Removes an object from an array
        removeObjectFromArray(array, method, value) {
            let index = this.arrayObjectIndexOf(array, method, value);
            if (index > -1) {
                array.splice(index, 1);
            }
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

        openOptionBox(postId) {
            let element = this.$refs[postId]
            if(!this.$refs[postId].classList.contains('show-element-block')){
                element.classList.add('show-element-block')
            }else{
                element.classList.remove('show-element-block')
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
                        // The Axios delete method won't accept a body, we have to use the req.param() option
                        headers: {
                            'Authorization': this.$store.state.token
                        },
                        params: {
                            'authorId': this.userObject.id,
                            'postId': post.id   
                        }
                    })
                    .then(() => {
                        post.arrayOfReactions.likes = this.removeElementFromArray(post.arrayOfReactions.likes, this.userObject.id)
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
                        // The Axios delete method won't accept a body, we have to use the req.param() option
                        headers: {
                            'Authorization': this.$store.state.token
                        },
                        params: {
                            'authorId': this.userObject.id,
                            'postId': post.id   
                        }
                    })
                    .then(() => {
                        // This code is here so that the button highlights immediately without another XHR
                        post.arrayOfReactions.dislikes = this.removeElementFromArray(post.arrayOfReactions.dislikes, this.userObject.id)
                    })
                }
            }
        },

        deletePost(postId, authorId){
            if(this.$store.state.userObject.id == authorId || this.$store.state.userObject.isAdmin == true){
                axios.delete(this.$store.state.URL + 'posts/' + postId, {
                    headers: {
                        'Authorization': this.$store.state.token
                    }
                })
                .then(() => {
                    // This line is here so that the post is taken off the DOM as well
                    this.removeObjectFromArray(this.$store.state.posts, "id", `${postId}`)
                })
            }else{
                console.log('Vous n\'êtes pas autorisé à supprimer ce message')
            }
        },
        loadProfile(profile){
            this.$store.state.loadedProfilePage = profile;
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

        & .profile-picture{
            width: 30px;
            height: 30px;
            border-radius: 5px 5px;
        }

        & .profile-link{
            text-decoration: none;
            padding-left: 5px;
            color: #FFFFFF;
            transition: color .3s;

            &:hover{
                color: #000000;
            }
        }
    }

    & .option-box{
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        cursor: pointer;

        & .options{
            background-color: rgba(0, 0, 0, .3);
            border-radius: 10px 10px;
            padding: 5px;
            cursor: pointer;
            margin: 0 5px;
            display: none;

            &_delete{
                color: #FFFFFF;
            }
        }
    }
}

.show-element-block{
    display: block !important;
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
    width: 100%;

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