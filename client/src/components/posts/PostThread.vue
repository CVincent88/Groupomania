<template>
<div>
    <li class="single-post" v-for="(post, index) in this.$store.state.posts"
        :key="post.id"
        :ref="`post${index}`"
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
                <button @click="reactOnPost(post, 1)" ref="{{`${post.id}`}}">J'aime</button>
                <span class="like-number reaction-number">{{ post.like }}</span>
            </div>
            <div class="dislikes">
                <button @click="reactOnPost(post, 0)">Je n'aime pas</button>
                <span class="dislike-number reaction-number">{{ post.dislike }}</span>
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
            alreadyPosted: [],
            error: '',
            loading: false,
            profileToLoad: 0,
            userId: localStorage.getItem('myUserId')
        }   
    },

    methods: {
        // doILike(post){
        //     const userId = this.userId;

        //     if(post.reactions.length > 0){
        //         for(let i=0; i<post.reactions.length; i++){
        //             if(post.reactions[i].authorId == userId && post.reactions[i].reaction == 1){
        //                 return true
        //             }else{
        //                 return false
        //             }
        //         }
        //     }else{
        //         return false
        //     }
        // },
        // doIDislike(post){
        //     const userId = this.userId;

        //     if(post.reactions.length > 0){
        //         for(let i=0; i<post.reactions.length; i++){
        //             if(post.reactions[i].authorId == userId && post.reactions[i].reaction == 0){
        //                 return true
        //             }else{
        //                 return false
        //             }
        //         }
        //     }else{
        //         return false
        //     }
        // },

        // Displays likes and dislikes
        showReactions(data) {
            const reactions = data[0].reactions;

            for (let i=0; i<reactions.length; i++){

                if(reactions[i].reaction === 0){
                    data[0].dislike += 1;
                    // Determine si le post est disliké par l'utilisateur
                    if(data[0].reactions[i].authorId == this.userId){
                        // Modifier style du bouton DISLIKE
                        console.log('Tu dislike le post')
                    }else{
                        // Style normal
                    }

                }else if(reactions[i].reaction === 1){
                    data[0].like += 1;
                    // Determine si le post est liké par l'utilisateur
                    if(data[0].reactions[i].authorId == this.userId){
                        // Modifier style du bouton LIKE
                        console.log('Tu like le post')
                    }else{
                        // Style normal
                    }
                }
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
            .then(({ data }) => {
                // Will check if the post id is already in the posts array
                const foundInPosts = this.$store.state.posts.find(element => element.id === data[0].id);
                // Will check if the post id is already in the alreadyPosted array
                const foundInPosted = this.alreadyPosted.find(element => element.id === data[0].id);

                // If the database is empty
                if (data.length < 1){
                    $state.complete();
                }

                // If it has not been displayed yet
                else if (!foundInPosts) {
                    // Répartition des likes et dislikes
                    this.showReactions(data)

                    this.$store.state.posts.push(...data);
                    $state.loaded();
                    console.log(this.$store.state.posts)
                    // Save the userId to load the correct profilePage
                    // this.profileToLoad = JSON.stringify(data[0].author.id)

                // If if has been displayed but not registered in the alreadyPosted array
                }else if(foundInPosts && !foundInPosted){
                    this.alreadyPosted.push(...data);
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
            if(reaction == 1){
                if(this.doILike(post) == false){
                    axios.post(this.$store.state.URL + 'likes/', {
                        reaction: reaction,
                        authorId: this.userId,
                        postId: post.id
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token
                        }
                    })
                    .then((res) => {
                        console.log(res)
                        this.$refs[`${post.id}`].addClass('activated-button')
                    })
                }else if(this.doILike(post) == true){
                    let id = Number;

                    for(let i=0; i<post.reactions.length; i++){
                        if(this.userId == post.reactions[i].authorId){
                            id = post.reactions[i].id
                        }
                    }
                    axios.delete(this.$store.state.URL + 'likes/', {
                        params: {
                            'id': id
                        }
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token,
                        }
                    })
                    .then((res) => {
                        console.log(res)
                    })
                }
            }else if(reaction == 0){
                if(this.doIDislike(post) == false){
                    axios.post(this.$store.state.URL + 'likes/', {
                        reaction: reaction,
                        authorId: this.userId,
                        postId: post.id
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token
                        }
                    })
                    .then(() => {
                        this.doILike(post)
                    })
                }else if(this.doIDislike(post) == true){
                    let id = Number;

                    for(let i=0; i<post.reactions.length; i++){
                        if(this.userId == post.reactions[i].authorId){
                            id = post.reactions[i].id
                        }
                    }
                    axios.delete(this.$store.state.URL + 'likes/', {
                        params: {
                            'id': id
                        }
                    },
                    {
                        headers: {
                            'Authorization': this.$store.state.token,
                        }
                    })
                    .then(() => {
                        this.doILike(post)
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