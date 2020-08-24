<template>
    <div class="home">
        <TopBanner/>
        <div class="wrapper">
            <CreatePost />
            <div class="post-thread">
                <p class="error" v-if="error">{{ error }}</p>
                <div class="post-model" v-for="(post) in posts" :item="post" :key="post.id">
                    <SinglePost :post="post" />
                </div>
                
                
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import TopBanner from '@/components/TopBanner.vue'
import SinglePost from '@/components/posts/SinglePost.vue'
import CreatePost from '@/components/posts/CreatePost.vue'
import postService from '@/postService.js'
// import axios from 'axios'

export default {
    name: 'Home',
    components: {
        TopBanner,
        SinglePost,
        CreatePost
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


<style lang="scss" scoped>

*{
    box-sizing: border-box;
}

.wrapper{
    width: 50%;
    margin: 10px auto;
    display: flex;
    flex-direction: column;

    & .post-thread{
        padding: 10px;

        & .post-model{
            display: flex;
            flex-direction: column;
            margin: 20px 8px;
            padding: 10px;
            background-color: #eff8fd;
            border-radius: 10px 10px;
            box-shadow: 2px 2px 10px rgba(195, 209, 216, .7);
        }
    }
}

</style>