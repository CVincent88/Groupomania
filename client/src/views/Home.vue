<template>
<div class="home">
    <TopBanner class="topBanner"/>
    <div class="wrapper" id="app">
        <div>
            <div class="me">
            {{ myName }}
            </div>
            <CreatePost />
        </div>
        <div class="list-group-wrapper">
            <ul class="list-group" id="infinite-list"> <!-- id utilisé par la méthode de PostThread -->
                <PostThread />
            </ul>
        </div>
    </div>
</div>
</template>


<script>
// @ is an alias to /src
import TopBanner from '@/components/TopBanner.vue'
import PostThread from '@/components/posts/PostThread.vue'
import CreatePost from '@/components/posts/CreatePost.vue'
import axios from 'axios'

export default {
    name: 'Home',
    components: {
        TopBanner,
        PostThread,
        CreatePost
    },
    data() {
        return {
            myName: ''
        }
    },
    beforeMount() {
        axios.get(this.$store.state.URL + 'users/' + localStorage.getItem('myUserId'), {
            headers: {
                'Authorization': this.$store.state.token
            },
        })
        .then((res) => {
            this.myName = res.data.firstName + ' ' + res.data.lastName
        })
    }
}
</script>


<style lang="scss" scoped>

.wrapper {
    display: flex;
    flex-flow: row wrap;
    border: 1px solid black;
    width: 95%;
    margin: 20px auto;
    justify-content: space-around;
}

.test{
    height: 200px;
    width: 200px;
}

.wrapper > * {
    flex-basis: 400px;
    flex-grow: 1;
}

.list-group-wrapper {
    position: relative;
}
.list-group {
    overflow: auto;
    height: 75vh;
    border: 2px solid #dce4ec;
    border-radius: 5px;
    padding: 10px 10px;
}



</style>