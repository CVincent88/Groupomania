<template>
<div class="post-creator">
    <textarea type="text" name="post" id="post" placeholder="Que souhaitez-vous publier ?" v-model="content"></textarea>
    <button @click="createPost">Publier</button>
</div>
</template>


<script>
import axios from 'axios'


export default {
    name: 'CreatePost',
    data() {
        return {
            content: '',
            userId: this.$store.state.userObject.id
        }
    },
    methods: {
        createPost() {
            axios.post(this.$store.state.URL + 'posts/', {
                authorId: this.userId,
                content: this.content,
            },
            {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then((res) => {
                this.eraseText();
                if (res.status === 200) {
                    axios.get(this.$store.state.URL + 'posts/' + res.data.id, {
                        headers: {
                            'Authorization': this.$store.state.token
                        }
                    })
                    .then((res) => {
                        let newPost = res.data;
                        newPost.arrayOfReactions = {
                            likes: [],
                            dislikes: [],
                        }
                        this.$store.state.posts.unshift(newPost)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        eraseText() {
            document.getElementById("post").value = "";
        }
    }
}
</script>

<style lang="scss" scoped>

.post-creator{
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding: 5px;
    background-color: #557d96;
    border-radius: 10px 10px;
    box-shadow: 2px 2px 10px rgba(195, 209, 216, .7);
    margin-bottom: 2em;

    & textarea{
        width: 100%;
        height: 100px;
        box-sizing: border-box;
        border-radius: 10px 10px;
        border: none;
        padding: 10px 10px;
        resize: none;


        &:focus{
            outline: 1px solid #347BE7;
        }
    }

    & button{
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 10px;
        border: none;
        border-radius: 4px 4px;
        outline: 0;
        background-color: #347BE7;
        padding: 5px;
        cursor: pointer;

    }
}

</style>