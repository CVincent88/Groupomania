<template>
    <div class="post-thread">
        <ul>
            <li class="list-element" v-for="post in posts" :key="post.id">
                <SinglePost :post="post"/>
            </li>
            <infinite-loading @infinite="infiniteHandler" spinner="circles"></infinite-loading>
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
            offSet: 0
        }
    },
    methods: {
        // Infinite scroll
        infiniteHandler($state) {
            axios.get(this.$store.state.URL + 'posts/' + 'offset/' + this.offSet, {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            // The following code will display the post only if it has not already been displayed.
            .then((post) => {
                const thisPost = post.data[0];

                if(thisPost != undefined){
                    thisPost.arrayOfReactions = this.createArrayOfReactions(thisPost);
                    
                    
                    // On enregistre et relance la boucle tant que le server renvoie un résultat
                    this.$store.state.posts.push(thisPost);
                    this.offSet ++;
                    $state.loaded();
                }else{
                    $state.complete();
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
}
</script>

<style lang="scss" scoped>

.post-thread ul{   
list-style-type: none;
padding-inline-start: 0;

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