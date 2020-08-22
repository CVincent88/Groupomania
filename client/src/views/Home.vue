<template>
    <div class="home">
        <div v-if="!$store.state.user.userAuthenticated">
            <Connection/>
        </div>

        <div class="homeLoggedIn" v-else>
            <TopBanner/>
            <div class="wrapper">
                <p class="error" v-if="error">{{ error }}</p>
                <div class="post-thread" v-for="(post) in posts" :item="post" :key="post.id">
                    <SinglePost :post="post" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Connection from '@/views/Connection.vue'
import TopBanner from '@/components/TopBanner.vue'
import SinglePost from '@/components/SinglePost.vue'
import postService from '@/postService.js'



export default {
    name: 'Home',
    components: {
        TopBanner,
        Connection,
        SinglePost
    },
    data() {
        return {
            posts: [],
            error: '',
            text: ''
        }
    },
    async created() {
        try{
            this.posts = await postService.getPosts()
        }catch(err){
            this.error = err.message;
        }
    }
}
</script>


<style lang="scss">

.wrapper{
    width: 50%;
    margin: 10px auto;
    display: flex;
    flex-direction: column;

    border: 1px solid black;

    & .post-thread{
        display: flex;
        flex-direction: column;
        margin: 8px;
        padding: 10px;
        background-color: #eff8fd;
        border-radius: 10px 10px;
    }
}

</style>