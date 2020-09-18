<template>
    <div class="post-thread">
        <ul>
            <li class="list-element" v-for="post in posts" :key="post.id">
                <SinglePost :post="post"/>
            </li>
            <infinite-loading @infinite="infiniteHandler"></infinite-loading>
        </ul>
    </div>
</template>


<script>
import SinglePost from './SinglePost'
import InfiniteLoading from 'vue-infinite-loading'
import axios from 'axios'



export default {
    name: 'PostThread',
    props: {
        posts: Array
    },
    components: {
        SinglePost,
        InfiniteLoading
    },
    data() {
        return {
            alreadyPosted: []
        }
    },
    methods: {
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
                    thisPost.arrayOfReactions = this.createArrayOfReactions(thisPost);
                    
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
                    this.removeFromArray(reactions.likes, post.reactions[i].authorId)
                }else if(reactions.disllikes.includes(post.reactions[i].authorId)){
                    this.removeFromArray(reactions.dislikes, post.reactions[i].authorId)
                }else{
                    console.log('erreur de la fonction: createArrayOfReactions()')
                }
            }
            return reactions
        },
    },
}
</script>

<style lang="scss" scoped>

.post-thread ul{   
list-style-type: none;

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



</style>