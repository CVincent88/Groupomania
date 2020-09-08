<template>
<div>
    <li class="single-post" v-for="post in posts" :key="post.id">

        <div class="user">
            <img class="profile-picture" src="../../../public/images/default_profile_picture.jpg" alt="Default profile picture">
            <span class="user_username">{{ `${post.author.firstName} ${post.author.lastName}` }}</span>
        </div>
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
            posts: [],
            alreadyPosted: [],
            error: '',
            loading: false
        }   
    },
    methods: {
        infiniteHandler($state) {
            axios.get(this.$store.state.URL + 'posts/', {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            // The following code will display the post only if it has not already been displayed.
            .then(({ data }) => {
                // Will check if the post id is already in the posts array
                const foundInPosts = this.posts.find(element => element.id === data[0].id);
                // Will check if the post id is already in the alreadyPosted array
                const foundInPosted = this.alreadyPosted.find(element => element.id === data[0].id);

                // If the database is empty
                if (data.length < 1){
                    $state.complete();
                }

                // If it has not been displayed yet
                else if (!foundInPosts) {
                    this.posts.push(...data);
                    $state.loaded();

                // If if has been displayed but not registered in the alreadyPosted array
                }else if(foundInPosts && !foundInPosted){
                    this.alreadyPosted.push(...data);
                    $state.loaded();

                // If it has been displayed and registered in the alreadyPosted array
                }else if(foundInPosts && foundInPosted){
                    // If we have not displayed every post yet
                    if(this.alreadyPosted.length < this.posts.length){
                        $state.loaded();
                    // If we have displayed every post
                    }else{
                        $state.complete();
                    }
                }
            });
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

</style>