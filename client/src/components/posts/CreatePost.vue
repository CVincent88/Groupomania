<template>
<div class="post-creator">
    <textarea type="text" name="post" id="post" placeholder="Que souaitez-vous publier ?" v-model="content"></textarea>
    <button @click="createPost">Publier</button>
</div>
</template>


<script>
import axios from 'axios'


export default {
    name: 'CreatePost',
    data() {
        return {
            URL: 'http://localhost:5000/api/v1/posts/',
            content: '',
            userId: localStorage.getItem('userId')
        }
    },
    methods: {
        createPost() {
            axios.post(this.URL, {
                authorId: this.userId,
                content: this.content,
            },
            {
                headers: {
                    'Authorization': this.$store.state.token
                }
            })
            .then((response) => {
                console.log(response)
                this.eraseText();

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
    margin: 20px 8px;
    padding: 10px;
    background-color: #425561;
    border-radius: 10px 10px;
    box-shadow: 2px 2px 10px rgba(195, 209, 216, .7);
    align-items: center;
    justify-content: center;
    overflow: hidden;

    & textarea{
        width: 95%;
        height: 200px;
        border-radius: 10px 10px;
        border: none;
        padding: 10px 10px;
        max-width: 99%;
        min-width: 95%;

        &:focus{
            outline: 1px solid #347BE7;
        }
    }

    & button{
        margin-top: 15px;
        border: none;
        border-radius: 4px 4px;
        outline: 0;
        background-color: #347BE7;
        min-width: 95%;
        height: 50px;
        cursor: pointer;

    }
}

</style>